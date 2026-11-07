import { Resend } from 'resend';
import { conference, conferenceDisclosures } from '../data/conference';
import type { ConferenceEntry } from './conference-entry';

export interface EntryRow { id: string; payload: string; submitted_at: string; }
interface DrawRow { event_id: string; winner_id: string | null; entry_count: number; drawn_at: string; email_sent_at: string | null; exhausted_notified_at: string | null; }

export async function saveConferenceEntry(db: D1Database, entry: ConferenceEntry, id: string, submittedAt: string) {
	// Enforce the deadline at the write, even when captcha verification started earlier.
	return db.prepare(`INSERT INTO conference_entries (id, event_id, email, payload, submitted_at)
		SELECT ?, ?, ?, ?, ? WHERE unixepoch('now') >= unixepoch(?) AND unixepoch('now') < unixepoch(?)
		ON CONFLICT(event_id, email) DO NOTHING`)
		.bind(id, conference.id, entry.email, JSON.stringify(entry), submittedAt, conference.opensAt, conference.closesAt).run();
}

export function entryNotes(entry: ConferenceEntry): string {
	return [
		`Source: ${conference.name} 2026 (${conference.id})`,
		`Phone: ${entry.phone}`, `Address: ${['streetAddress' in entry && typeof entry.streetAddress === 'string' ? entry.streetAddress : '', entry.town, entry.island, entry.postalCode].filter(Boolean).join(', ')}`,
		`Farm / business: ${entry.organization || 'Not provided'}`, `Profession: ${entry.profession}`,
		`Farm size: ${entry.farmSize}`, `Farming experience: ${entry.experience}`,
		`Email updates opt-in: ${entry.emailOptIn ? 'Yes' : 'No'}`, 'Drawing contact consent: Yes',
		'Offer: Chance at 15% off one three uila of choice, including add-ons.',
	].join('\n');
}

export async function queueConferenceLead(env: Cloudflare.Env, row: EntryRow): Promise<void> {
	const entry = JSON.parse(row.payload) as ConferenceEntry;
	await env.WEBSITE_LEADS_QUEUE.send({
		type: 'website-contact-submitted', submissionId: row.id,
		name: `${entry.firstName} ${entry.lastName}`, contact: entry.email,
		...(entry.vehicle !== 'Not sure yet' && { vehicle: entry.vehicle }),
		message: entryNotes(entry), submittedAt: row.submitted_at,
		...(entry.leadPayloadVersion === 2 && { conference: { eventId: conference.id, firstName: entry.firstName, lastName: entry.lastName, phone: entry.phone } }),
	});
	await env.CONFERENCE_DB.prepare('UPDATE conference_entries SET lead_queued_at = ? WHERE id = ?')
		.bind(new Date().toISOString(), row.id).run();
}

/** Rejection sampling avoids bias when the number of entrants does not divide 2^32. */
export function randomEntryIndex(count: number): number {
	if (!Number.isSafeInteger(count) || count < 1 || count > 0xffffffff) throw new Error('Invalid entry count.');
	const limit = 0x100000000 - (0x100000000 % count);
	const buffer = new Uint32Array(1);
	do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
	return buffer[0] % count;
}

export type AwardStatus = 'pending' | 'notified' | 'accepted' | 'declined' | 'expired';
export interface AwardRound {
	id: string; event_id: string; round_number: number; entry_id: string; status: AwardStatus;
	selected_at: string; notified_at: string | null; accept_by: string | null;
	responded_at: string | null; redeem_by: string | null; owner_notified_status: string | null;
}

const hourMs = 60 * 60 * 1000;
const awardMessage = (roundId: string) => new TextEncoder().encode(`${conference.id}\n${roundId}`);

async function awardKey(secret: string) {
	if (!secret || secret.length < 32) throw new Error('Conference response signing is not configured.');
	return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function awardToken(secret: string, roundId: string): Promise<string> {
	const signature = await crypto.subtle.sign('HMAC', await awardKey(secret), awardMessage(roundId));
	return [...new Uint8Array(signature)].map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function loadAward(env: Cloudflare.Env, roundId: string, token: string): Promise<AwardRound | null> {
	if (!roundId || roundId.length > 200 || !/^[a-f0-9]{64}$/.test(token)) return null;
	const signature = new Uint8Array(token.match(/../g)!.map(value => parseInt(value, 16)));
	if (!await crypto.subtle.verify('HMAC', await awardKey(env.CONFERENCE_DRAW_SECRET), signature, awardMessage(roundId))) return null;
	return env.CONFERENCE_DB.prepare('SELECT * FROM conference_draw_rounds WHERE id = ? AND event_id = ?').bind(roundId, conference.id).first<AwardRound>();
}

export class AwardDecisionError extends Error {
	constructor(message: string, public status: number) { super(message); }
}

export async function decideAward(env: Cloudflare.Env, roundId: string, token: string, decision: string, now = new Date()): Promise<void> {
	const round = await loadAward(env, roundId, token);
	if (!round) throw new AwardDecisionError('This response link is invalid.', 403);
	if (decision !== 'accepted' && decision !== 'declined') throw new AwardDecisionError('Choose Accept or Decline.', 400);
	if (round.status === decision) return;
	if (round.status !== 'notified') throw new AwardDecisionError('This selection is no longer open for a response.', 409);
	if (!round.accept_by || now.getTime() >= Date.parse(round.accept_by)) throw new AwardDecisionError('The 48-hour acceptance deadline has passed.', 409);
	const result = await env.CONFERENCE_DB.prepare(`UPDATE conference_draw_rounds SET status = ?, responded_at = ?, redeem_by = ?
		WHERE id = ? AND status = 'notified' AND accept_by > ? AND julianday('now') < julianday(accept_by)`)
		.bind(decision, now.toISOString(), decision === 'accepted' ? new Date(now.getTime() + conference.redemptionDays * 24 * hourMs).toISOString() : null, round.id, now.toISOString()).run();
	if (!result.meta.changes) throw new AwardDecisionError('This selection has expired or already received a response.', 409);
}

function formatTime(value: string): string {
	return new Intl.DateTimeFormat('en-US', { timeZone: 'Pacific/Honolulu', dateStyle: 'long', timeStyle: 'short' }).format(new Date(value)) + ' HST';
}

async function sendInternalEmail(env: Cloudflare.Env, key: string, subject: string, text: string): Promise<void> {
	const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
		from: 'Three Uilas Conference <contact@submissions.threeuilas.com>', to: ['info@threeuilas.com'], replyTo: 'info@threeuilas.com', subject, text,
	}, { idempotencyKey: key });
	if (error) throw new Error(`Conference email failed: ${error.name}`);
}

async function latestRound(db: D1Database): Promise<AwardRound | null> {
	return db.prepare('SELECT * FROM conference_draw_rounds WHERE event_id = ? ORDER BY round_number DESC LIMIT 1').bind(conference.id).first<AwardRound>();
}

async function insertRound(db: D1Database, entryId: string, number: number, now: Date): Promise<void> {
	await db.prepare(`INSERT OR IGNORE INTO conference_draw_rounds (id, event_id, round_number, entry_id, status, selected_at)
		SELECT ?, ?, ?, ?, 'pending', ? WHERE NOT EXISTS
		(SELECT 1 FROM conference_draw_rounds WHERE event_id = ? AND status IN ('pending', 'notified', 'accepted'))`)
		.bind(crypto.randomUUID(), conference.id, number, entryId, now.toISOString(), conference.id).run();
}

async function notifyOwner(env: Cloudflare.Env, round: AwardRound): Promise<void> {
	const row = await env.CONFERENCE_DB.prepare('SELECT payload FROM conference_entries WHERE id = ?').bind(round.entry_id).first<{ payload: string }>();
	if (!row) throw new Error('Selected conference entry is missing.');
	const entry = JSON.parse(row.payload) as ConferenceEntry;
	const state = round.status === 'pending' ? 'Selected — manual notification needed' : round.status === 'notified' ? 'Manual notification recorded — awaiting acceptance' : round.status === 'accepted' ? 'Accepted — arrange the discounted order' : round.status === 'declined' ? 'Declined — replacement drawing due' : 'Acceptance expired — replacement drawing due';
	const managementUrl = `https://ops.threeuilas.com/sales/leads/${encodeURIComponent(round.entry_id)}`;
	const text = [
		`${conference.name}\nSelection ${round.round_number}: ${state}.`,
		`Selected entrant: ${entry.firstName} ${entry.lastName}\nEmail: ${entry.email}\n${entryNotes(entry)}`,
		conferenceDisclosures.reward,
		`Internal Three Uilas management link:\n${managementUrl}\nKeep this link private; do not forward this email to the entrant.`,
		round.status === 'pending' ? 'No notification has been sent to the entrant. Contact them manually, then use the management page to record that you sent the notification. Their 48-hour acceptance period has not started.' : '',
		round.accept_by ? `Acceptance deadline: ${formatTime(round.accept_by)}.` : '',
		round.redeem_by ? `Accepted on ${formatTime(round.responded_at!)}. Discount must be used by ${formatTime(round.redeem_by)}. Apply 15% to the entire pre-tax order subtotal, including all line items and delivery; tax is excluded.` : '',
		round.status === 'notified' ? 'Three Uilas recorded the manual notification. No automated message has been sent to the entrant. Use the ops lead page to record their acceptance or decline.' : '',
		`Reference: ${round.id}. Previously selected entrants are excluded from replacement drawings.`,
	].filter(Boolean).join('\n\n');
	await sendInternalEmail(env, `conference-award/${round.id}/owner/${round.status}`, `Conference drawing: ${state} (selection ${round.round_number})`, text);
	await env.CONFERENCE_DB.prepare('UPDATE conference_draw_rounds SET owner_notified_status = ? WHERE id = ? AND status = ?').bind(round.status, round.id, round.status).run();
}

export async function runConferenceDrawing(env: Cloudflare.Env, now = new Date()): Promise<void> {
	if (now.getTime() < Date.parse(conference.closesAt)) return;
	const db = env.CONFERENCE_DB;
	let draw = await db.prepare('SELECT * FROM conference_draws WHERE event_id = ?').bind(conference.id).first<DrawRow>();
	if (!draw) {
		const count = await db.prepare('SELECT COUNT(*) AS total FROM conference_entries WHERE event_id = ?').bind(conference.id).first<{ total: number }>();
		const total = count?.total ?? 0;
		const winner = total ? await db.prepare('SELECT id FROM conference_entries WHERE event_id = ? ORDER BY id LIMIT 1 OFFSET ?')
			.bind(conference.id, randomEntryIndex(total)).first<{ id: string }>() : null;
		await db.prepare('INSERT OR IGNORE INTO conference_draws (event_id, winner_id, entry_count, drawn_at) VALUES (?, ?, ?, ?)')
			.bind(conference.id, winner?.id ?? null, total, now.toISOString()).run();
		draw = await db.prepare('SELECT * FROM conference_draws WHERE event_id = ?').bind(conference.id).first<DrawRow>();
	}
	if (!draw) throw new Error('Conference drawing was not saved.');
	if (!draw.winner_id) {
		if (!draw.email_sent_at) {
			await sendInternalEmail(env, `conference-draw/${conference.id}/empty`, 'Conference drawing complete — no accepted entries', `The conference has ended. No accepted entries were received; no award was made.\nEntry cutoff: ${conference.deadline}.`);
			await db.prepare('UPDATE conference_draws SET email_sent_at = ? WHERE event_id = ?').bind(now.toISOString(), conference.id).run();
		}
		return;
	}
	let round = await latestRound(db);
	if (!round) { await insertRound(db, draw.winner_id, 1, now); round = await latestRound(db); }
	await db.prepare(`UPDATE conference_draw_rounds SET status = 'expired', responded_at = ? WHERE event_id = ? AND status = 'notified' AND accept_by <= ?`)
		.bind(now.toISOString(), conference.id, now.toISOString()).run();
	round = await latestRound(db);
	if (round && (round.status === 'declined' || round.status === 'expired')) {
		const count = await db.prepare(`SELECT COUNT(*) AS total FROM conference_entries e WHERE event_id = ? AND NOT EXISTS (SELECT 1 FROM conference_draw_rounds r WHERE r.event_id = e.event_id AND r.entry_id = e.id)`)
			.bind(conference.id).first<{ total: number }>();
		if (count?.total) {
			const candidate = await db.prepare(`SELECT e.id FROM conference_entries e WHERE event_id = ? AND NOT EXISTS (SELECT 1 FROM conference_draw_rounds r WHERE r.event_id = e.event_id AND r.entry_id = e.id) ORDER BY e.id LIMIT 1 OFFSET ?`)
				.bind(conference.id, randomEntryIndex(count.total)).first<{ id: string }>();
			if (candidate) await insertRound(db, candidate.id, round.round_number + 1, now);
		} else if (!draw.exhausted_notified_at) {
			await sendInternalEmail(env, `conference-draw/${conference.id}/exhausted`, 'Conference drawing ended — all selected entrants declined or timed out', 'Every accepted entry has been selected, and no selected entrant accepted within their response window. No award was accepted. The selection history is retained.');
			await db.prepare('UPDATE conference_draws SET exhausted_notified_at = ? WHERE event_id = ?').bind(now.toISOString(), conference.id).run();
		}
		round = await latestRound(db);
	}
	const notices = await db.prepare(`SELECT * FROM conference_draw_rounds WHERE event_id = ? AND (owner_notified_status IS NULL OR owner_notified_status <> status) ORDER BY round_number LIMIT 25`).bind(conference.id).all<AwardRound>();
	for (const notice of notices.results) await notifyOwner(env, notice);
}

async function forwardPendingLeads(env: Cloudflare.Env): Promise<void> {
	const pending = await env.CONFERENCE_DB.prepare('SELECT id, payload, submitted_at FROM conference_entries WHERE event_id = ? AND lead_queued_at IS NULL LIMIT 25').bind(conference.id).all<EntryRow>();
	for (const row of pending.results) {
		try { await queueConferenceLead(env, row); }
		catch { console.error('Conference lead forwarding failed; retained for scheduled retry.'); }
	}
}

export async function processConferenceSchedule(env: Cloudflare.Env, now = new Date()): Promise<void> {
	const results = await Promise.allSettled([runConferenceDrawing(env, now), forwardPendingLeads(env)]);
	const failure = results.find(result => result.status === 'rejected');
	if (failure?.status === 'rejected') throw failure.reason;
}
