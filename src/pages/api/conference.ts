import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { conference } from '../../data/conference';
import { validateConferenceEntry } from '../../lib/conference-entry';
import { queueConferenceLead, saveConferenceEntry } from '../../lib/conference-server';

export const prerender = false;
const json = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request }) => {
	if (request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'Please submit your entry from the conference page.' }, 403);
	let data: FormData;
	try { data = await request.formData(); } catch { return json({ error: 'Invalid request. Please try again.' }, 400); }
	if (data.get('website')) return json({ error: 'Invalid request.' }, 400);
	const result = validateConferenceEntry(data);
	if (result.error) return json({ error: result.error, field: result.field }, 400);
	const now = Date.now();
	if (now < Date.parse(conference.opensAt)) return json({ error: 'Entries are not open yet. Please try again shortly.' }, 403);
	if (now >= Date.parse(conference.closesAt)) return json({ error: 'Entries closed November 10 at 5:00 p.m. HST. Thank you for visiting.' }, 403);
	const token = data.get('cf-turnstile-response');
	if (typeof token !== 'string' || !token || token.length > 2048) return json({ error: 'Please complete the verification, then try again.' }, 400);
	try {
		const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
			signal: AbortSignal.timeout(10_000),
		});
		const verified = await verification.json() as { success?: boolean };
		if (!verification.ok || !verified.success) return json({ error: 'Verification expired or failed. Please complete it again.' }, 400);
	} catch { return json({ error: 'Verification is temporarily unavailable. Please try again.' }, 503); }
	const entry = result.entry!;
	const id = crypto.randomUUID();
	const submittedAt = new Date().toISOString();
	try {
		const saved = await saveConferenceEntry(env.CONFERENCE_DB, entry, id, submittedAt);
		if (!saved.meta.changes) {
			const existing = await env.CONFERENCE_DB.prepare('SELECT id FROM conference_entries WHERE event_id = ? AND email = ?').bind(conference.id, entry.email).first();
			if (existing) return json({ success: true });
			return json({ error: 'The entry window has closed. Thank you for visiting.' }, 403);
		}
		try { await queueConferenceLead(env, { id, payload: JSON.stringify(entry), submitted_at: submittedAt }); }
		catch { console.error('Conference entry saved; operations forwarding pending scheduled retry.'); }
		return json({ success: true });
	} catch {
		console.error('Conference entry storage failed.');
		return json({ error: 'We could not save your entry. Your details are still here; please try again.' }, 503);
	}
};
