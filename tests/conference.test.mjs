import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { conference, professions, farmSizes, experienceLevels, islands, modelInterests } from '../src/data/conference';
import { validateConferenceEntry } from '../src/lib/conference-entry';
import { entryNotes, randomEntryIndex, runConferenceDrawing, processConferenceSchedule, saveConferenceEntry, awardToken, loadAward, decideAward, queueConferenceLead } from '../src/lib/conference-server';

const entry = {
	firstName: 'Test', lastName: 'Farmer', email: 'test@example.com', phone: '(808) 555-0100',
	town: 'Hilo', island: islands[0], postalCode: '', organization: '',
	profession: professions[0], farmSize: farmSizes[1], experience: experienceLevels[1],
	vehicle: modelInterests[0], emailOptIn: false, termsVersion: conference.termsVersion,
};

function form(overrides = {}) {
	const data = new FormData();
	for (const [key, value] of Object.entries({ ...entry, entryConsent: 'yes', ...overrides })) {
		if (typeof value === 'string') data.set(key, value);
	}
	return data;
}

function database(includeClaims = true) {
	const sqlite = new DatabaseSync(':memory:');
	sqlite.exec(readFileSync('migrations/0001_conference.sql', 'utf8'));
	if (includeClaims) sqlite.exec(readFileSync('migrations/0002_conference_award_claims.sql', 'utf8'));
	const clock = { now: Date.parse(conference.closesAt) };
	sqlite.function('julianday', value => (value === 'now' ? clock.now : Date.parse(value)) / 86400000 + 2440587.5);
	const db = { prepare(sql) {
		let values = [];
		return {
			bind(...args) { values = args; return this; },
			async first() { return sqlite.prepare(sql).get(...values) ?? null; },
			async all() { return { results: sqlite.prepare(sql).all(...values) }; },
			async run() { const result = sqlite.prepare(sql).run(...values); return { meta: { changes: Number(result.changes) } }; },
		};
	} };
	return { sqlite, db, clock };
}

function seed(sqlite, count = 4) {
	for (let i = 0; i < count; i++) sqlite.prepare('INSERT INTO conference_entries (id, event_id, email, payload, submitted_at, lead_queued_at) VALUES (?, ?, ?, ?, ?, ?)')
		.run(`entrant-${i}`, conference.id, `farmer-${i}@example.com`, JSON.stringify({ ...entry, email: `farmer-${i}@example.com` }), conference.opensAt, conference.opensAt);
}

test('contact validation rejects missing, malformed, oversized, file, and unsupported values', () => {
	assert.ok(validateConferenceEntry(form()).entry);
	for (const change of [{ firstName: '' }, { email: 'invalid' }, { phone: '808' }, { phone: 'abcdefghij' }, { town: '' }, { profession: 'invented' }, { farmSize: '' }, { experience: '' }, { island: '' }, { vehicle: '' }, { entryConsent: '' }, { organization: 'x'.repeat(151) }]) {
		assert.ok(validateConferenceEntry(form(change)).error, JSON.stringify(change));
	}
	const file = form(); file.set('email', new Blob(['invalid']), 'test.txt');
	assert.equal(validateConferenceEntry(file).field, 'email');
	assert.equal(validateConferenceEntry(form({ email: ' TEST@EXAMPLE.COM ', emailOptIn: 'yes' })).entry.email, 'test@example.com');
	assert.equal(validateConferenceEntry(form()).entry.emailOptIn, false);
	assert.equal(validateConferenceEntry(form({ emailOptIn: 'yes' })).entry.emailOptIn, true);
	assert.equal('streetAddress' in validateConferenceEntry(form({ streetAddress: 'Do not collect this' })).entry, false);
	assert.equal(validateConferenceEntry(form()).entry.termsVersion, conference.termsVersion);
	assert.equal(validateConferenceEntry(form({ termsVersion: '' })).field, 'termsVersion');
	assert.equal(validateConferenceEntry(form({ termsVersion: 'old-terms' })).field, 'termsVersion');
});

test('the deadline is November 10 at 5 p.m. Hawaiʻi time', () => {
	assert.equal(new Intl.DateTimeFormat('en-US', { timeZone: 'Pacific/Honolulu', dateStyle: 'short', timeStyle: 'short' }).format(new Date(conference.closesAt)), '11/10/26, 5:00 PM');
});

test('maximum accepted fields fit the existing operations lead limit', () => {
	const result = validateConferenceEntry(form({
		firstName: 'x'.repeat(80), lastName: 'x'.repeat(100),
		town: 'x'.repeat(100), postalCode: 'x'.repeat(20), organization: 'x'.repeat(150),
		profession: professions.reduce((a, b) => a.length > b.length ? a : b),
	}));
	assert.ok(result.entry);
	assert.ok(entryNotes(result.entry).length <= 2000);
});

test('database permits one entry per event and normalized email', () => {
	const { sqlite } = database(); seed(sqlite, 1);
	assert.throws(() => sqlite.prepare('INSERT INTO conference_entries (id, event_id, email, payload, submitted_at) VALUES (?, ?, ?, ?, ?)')
		.run('duplicate', conference.id, 'farmer-0@example.com', JSON.stringify(entry), conference.opensAt), /UNIQUE/);
	sqlite.close();
});

test('database rejects writes before opening and at the cutoff, including slow verification; retries preserve the first entry', async () => {
	const { sqlite, db } = database();
	let now = Date.parse(conference.opensAt) - 1000;
	sqlite.function('unixepoch', value => Math.floor((value === 'now' ? now : Date.parse(value)) / 1000));
	assert.equal((await saveConferenceEntry(db, entry, 'before-open', new Date(now).toISOString())).meta.changes, 0);
	now = Date.parse(conference.opensAt);
	assert.equal((await saveConferenceEntry(db, entry, 'accepted', new Date(now).toISOString())).meta.changes, 1);
	assert.equal((await saveConferenceEntry(db, { ...entry, firstName: 'Changed' }, 'retry', new Date(now).toISOString())).meta.changes, 0);
	assert.equal(JSON.parse(sqlite.prepare('SELECT payload FROM conference_entries').get().payload).firstName, 'Test');
	now = Date.parse(conference.closesAt) - 1000;
	assert.equal((await saveConferenceEntry(db, { ...entry, email: 'last@example.com' }, 'last', new Date(now).toISOString())).meta.changes, 1);
	now = Date.parse(conference.closesAt);
	assert.equal((await saveConferenceEntry(db, { ...entry, email: 'late@example.com' }, 'late', new Date(now - 30_000).toISOString())).meta.changes, 0);
	assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM conference_entries').get().n, 2);
	sqlite.close();
});

test('random indexes stay in range, handle one entrant, and reject invalid counts', () => {
	assert.equal(randomEntryIndex(1), 0);
	for (let i = 0; i < 100; i++) { const index = randomEntryIndex(7); assert.ok(index >= 0 && index < 7); }
	for (const count of [0, -1, 1.5, Infinity, 0x100000000]) assert.throws(() => randomEntryIndex(count));
});

const testSecret = 'conference-test-key-never-used-in-production-123456';
test('new entries carry structured contact metadata while legacy queued retries remain unchanged', async () => {
	const { sqlite, db } = database(); seed(sqlite, 1);
	const messages = [], env = environment(db);
	env.WEBSITE_LEADS_QUEUE.send = async message => { messages.push(message); };
	const row = { id: 'entrant-0', payload: JSON.stringify(entry), submitted_at: conference.opensAt };
	await queueConferenceLead(env, row);
	assert.equal('conference' in messages[0], false);
	await queueConferenceLead(env, { ...row, payload: JSON.stringify(validateConferenceEntry(form()).entry) });
	assert.deepEqual(messages[1].conference, { eventId: conference.id, firstName: entry.firstName, lastName: entry.lastName, phone: entry.phone });
	assert.equal(messages[1].submissionId, messages[0].submissionId);
	sqlite.close();
});
const environment = db => ({ CONFERENCE_DB: db, RESEND_API_KEY: 'test-never-sent', CONFERENCE_DRAW_SECRET: testSecret, WEBSITE_LEADS_QUEUE: { async send() {} } });
const currentRound = sqlite => sqlite.prepare('SELECT * FROM conference_draw_rounds ORDER BY round_number DESC LIMIT 1').get();

// Model staff notification; authenticated ops transition and audit have independent integration tests.
function manuallyNotify(sqlite, at = conference.closesAt) {
	const round = currentRound(sqlite);
	sqlite.prepare("UPDATE conference_draw_rounds SET status = 'notified', notified_at = ?, accept_by = ? WHERE id = ?").run(at, new Date(Date.parse(at) + 48 * 3600000).toISOString(), round.id);
	return currentRound(sqlite);
}

async function emails(work, shouldFail = () => false) {
	const originalFetch = globalThis.fetch;
	const sent = new Map();
	globalThis.fetch = async (url, options) => {
		assert.equal(String(url), 'https://api.resend.com/emails');
		const body = JSON.parse(options.body);
		assert.deepEqual(body.to, ['info@threeuilas.com'], 'Automated emails must stay internal');
		const key = new Headers(options.headers).get('Idempotency-Key');
		assert.ok(key);
		if (shouldFail(body, key)) return Response.json({ name: 'application_error', message: 'Test failure' }, { status: 500 });
		if (sent.has(key)) assert.deepEqual(body, sent.get(key));
		else sent.set(key, body);
		return Response.json({ id: `test-email-${key}` });
	};
	try { await work(sent); } finally { globalThis.fetch = originalFetch; }
}

test('initial selection waits for closing, emails only ops once, and waits indefinitely for manual contact', async () => {
	const { sqlite, db } = database(); seed(sqlite);
	await emails(async sent => {
		const env = environment(db);
		await runConferenceDrawing(env, new Date(Date.parse(conference.closesAt) - 1));
		assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM conference_draws').get().n, 0);
		await Promise.all([runConferenceDrawing(env, new Date(conference.closesAt)), runConferenceDrawing(env, new Date(conference.closesAt))]);
		const draw = sqlite.prepare('SELECT * FROM conference_draws').get();
		const round = currentRound(sqlite);
		assert.equal(draw.entry_count, 4); assert.equal(round.entry_id, draw.winner_id);
		assert.equal(round.status, 'pending'); assert.equal(round.owner_notified_status, 'pending');
		assert.equal(round.accept_by, null); assert.equal(round.notified_at, null);
		assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM conference_draw_rounds').get().n, 1);
		assert.equal(sent.size, 1);
		const owner = [...sent.values()].find(mail => mail.to[0] === 'info@threeuilas.com');
		assert.ok(owner.text.includes('(808) 555-0100'));
		assert.ok(owner.text.includes(`https://ops.threeuilas.com/sales/leads/${round.entry_id}`));
		assert.ok(owner.text.includes('has not started'));
		await runConferenceDrawing(env, new Date(Date.parse(conference.closesAt) + 10 * 86400000));
		assert.equal(sent.size, 1); assert.equal(currentRound(sqlite).id, round.id);
		assert.equal(currentRound(sqlite).status, 'pending');
	});
	sqlite.close();
});

test('signed responses reject tampering, accept only once, set exactly 30 days, and leave accepted awards final', async () => {
	const { sqlite, db, clock } = database(); seed(sqlite, 3);
	await emails(async sent => {
		const env = environment(db);
		await runConferenceDrawing(env, new Date(conference.closesAt));
		const round = manuallyNotify(sqlite);
		const token = await awardToken(testSecret, round.id);
		assert.ok(await loadAward(env, round.id, token));
		assert.equal(await loadAward(env, round.id, '0'.repeat(64)), null);
		assert.equal(await loadAward(env, 'different-round', token), null);
		await assert.rejects(decideAward(env, round.id, '0'.repeat(64), 'accepted'), error => error.status === 403);
		clock.now = Date.parse(round.notified_at) + 1000;
		await decideAward(env, round.id, token, 'accepted', new Date(clock.now));
		const accepted = currentRound(sqlite);
		assert.equal(accepted.status, 'accepted');
		assert.equal(Date.parse(accepted.redeem_by) - clock.now, 30 * 86400000);
		await decideAward(env, round.id, token, 'accepted', new Date(clock.now + 1000));
		assert.equal(currentRound(sqlite).redeem_by, accepted.redeem_by);
		await assert.rejects(decideAward(env, round.id, token, 'declined', new Date(clock.now)), error => error.status === 409);
		await runConferenceDrawing(env, new Date(clock.now));
		assert.ok([...sent.values()].some(mail => mail.to[0] === 'info@threeuilas.com' && mail.subject.includes('Accepted')));
		await runConferenceDrawing(env, new Date(clock.now + 40 * 86400000));
		assert.equal(currentRound(sqlite).id, round.id);
		assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM conference_draw_rounds').get().n, 1);
	});
	sqlite.close();
});

test('declines trigger one random replacement from the remaining entries, including overlapping jobs', async () => {
	const { sqlite, db, clock } = database(); seed(sqlite, 4);
	await emails(async () => {
		const env = environment(db);
		await runConferenceDrawing(env, new Date(conference.closesAt));
		const first = manuallyNotify(sqlite);
		clock.now = Date.parse(first.notified_at) + 1000;
		await decideAward(env, first.id, await awardToken(testSecret, first.id), 'declined', new Date(clock.now));
		await Promise.all([runConferenceDrawing(env, new Date(clock.now)), runConferenceDrawing(env, new Date(clock.now))]);
		const second = currentRound(sqlite);
		assert.equal(second.round_number, 2); assert.notEqual(second.entry_id, first.entry_id);
		assert.equal(second.status, 'pending');
		assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM conference_draw_rounds').get().n, 2);
		assert.equal(sqlite.prepare('SELECT status FROM conference_draw_rounds WHERE id = ?').get(first.id).status, 'declined');
	});
	sqlite.close();
});

test('the 48-hour boundary rejects late acceptance and redraws without reselecting the expired entrant', async () => {
	const { sqlite, db, clock } = database(); seed(sqlite, 3);
	await emails(async () => {
		const env = environment(db);
		await runConferenceDrawing(env, new Date(conference.closesAt));
		const first = manuallyNotify(sqlite);
		clock.now = Date.parse(first.accept_by);
		await assert.rejects(decideAward(env, first.id, await awardToken(testSecret, first.id), 'accepted', new Date(clock.now)), error => error.status === 409);
		await runConferenceDrawing(env, new Date(clock.now));
		assert.equal(sqlite.prepare('SELECT status FROM conference_draw_rounds WHERE id = ?').get(first.id).status, 'expired');
		const second = currentRound(sqlite);
		assert.equal(second.round_number, 2); assert.notEqual(second.entry_id, first.entry_id);
	});
	sqlite.close();
});

test('internal reminder failures retain the selected entrant without starting their acceptance clock', async () => {
	const { sqlite, db } = database(); seed(sqlite, 2);
	let failures = 1;
	await emails(async () => {
		const env = environment(db);
		await assert.rejects(runConferenceDrawing(env, new Date(conference.closesAt)), /email failed/);
		const pending = currentRound(sqlite);
		assert.equal(pending.status, 'pending'); assert.equal(pending.accept_by, null);
		await runConferenceDrawing(env, new Date(Date.parse(conference.closesAt) + 600000));
		const notified = currentRound(sqlite);
		assert.equal(notified.id, pending.id); assert.equal(notified.entry_id, pending.entry_id);
		assert.equal(notified.status, 'pending');
		assert.equal(notified.notified_at, null); assert.equal(notified.accept_by, null);
	}, () => failures-- > 0);
	sqlite.close();
});

test('owner reminder retries send only one internal email', async () => {
	const { sqlite, db } = database(); seed(sqlite, 2);
	let failed = false;
	await emails(async sent => {
		const env = environment(db);
		await assert.rejects(runConferenceDrawing(env, new Date(conference.closesAt)), /email failed/);
		const before = currentRound(sqlite);
		await runConferenceDrawing(env, new Date(Date.parse(conference.closesAt) + 600000));
		assert.equal(currentRound(sqlite).accept_by, before.accept_by);
		assert.equal(sent.size, 1);
	}, body => {
		if (body.to[0] === 'info@threeuilas.com' && !failed) { failed = true; return true; }
		return false;
	});
	sqlite.close();
});

test('empty pools and exhaustion send one business notice and never select a previous entrant', async () => {
	for (const count of [0, 1]) {
		const { sqlite, db, clock } = database(); seed(sqlite, count);
		await emails(async sent => {
			const env = environment(db);
			await runConferenceDrawing(env, new Date(conference.closesAt));
			if (count) {
				const round = manuallyNotify(sqlite); clock.now = Date.parse(round.notified_at) + 1000;
				await decideAward(env, round.id, await awardToken(testSecret, round.id), 'declined', new Date(clock.now));
				await runConferenceDrawing(env, new Date(clock.now));
				assert.ok(sqlite.prepare('SELECT exhausted_notified_at FROM conference_draws').get().exhausted_notified_at);
				assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM conference_draw_rounds').get().n, 1);
			} else assert.equal(sent.size, 1);
			const total = sent.size;
			await runConferenceDrawing(env, new Date(Date.parse(conference.closesAt) + 86400000));
			assert.equal(sent.size, total);
		});
		sqlite.close();
	}
});

test('migration preserves an existing selection and starts a response round without rerolling it', async () => {
	const { sqlite, db } = database(false); seed(sqlite, 2);
	sqlite.prepare('INSERT INTO conference_draws (event_id, winner_id, entry_count, drawn_at, email_sent_at) VALUES (?, ?, 2, ?, ?)')
		.run(conference.id, 'entrant-0', conference.closesAt, conference.closesAt);
	sqlite.exec(readFileSync('migrations/0002_conference_award_claims.sql', 'utf8'));
	await emails(async () => {
		await runConferenceDrawing(environment(db), new Date(conference.closesAt));
		assert.equal(currentRound(sqlite).entry_id, 'entrant-0');
		assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM conference_draw_rounds').get().n, 1);
	});
	sqlite.close();
});

test('lead forwarding retains stable payloads and a queue outage does not stop selection', async () => {
	const { sqlite, db } = database(); seed(sqlite, 1);
	sqlite.prepare('UPDATE conference_entries SET lead_queued_at = NULL').run();
	let payload;
	const env = environment(db);
	env.WEBSITE_LEADS_QUEUE.send = async message => { payload = message; throw new Error('Test outage'); };
	await emails(async sent => {
		await processConferenceSchedule(env, new Date(conference.closesAt));
		assert.equal(payload.submissionId, 'entrant-0'); assert.equal(payload.submittedAt, conference.opensAt);
		assert.equal(payload.contact, 'farmer-0@example.com');
		assert.equal(sqlite.prepare('SELECT lead_queued_at FROM conference_entries').get().lead_queued_at, null);
		assert.equal(currentRound(sqlite).status, 'pending'); assert.equal(sent.size, 1);
		env.WEBSITE_LEADS_QUEUE.send = async message => { payload = message; };
		await processConferenceSchedule(env, new Date(conference.closesAt));
		assert.ok(sqlite.prepare('SELECT lead_queued_at FROM conference_entries').get().lead_queued_at);
	});
	sqlite.close();
});
