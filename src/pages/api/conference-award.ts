import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { AwardDecisionError, decideAward, processConferenceSchedule } from '../../lib/conference-server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'same-origin' };
	if (request.headers.get('origin') !== new URL(request.url).origin) return new Response('Submit your response from the award page.', { status: 403, headers });
	let data: FormData;
	try { data = await request.formData(); } catch { return new Response('Invalid request.', { status: 400, headers }); }
	const text = (field: string) => typeof data.get(field) === 'string' ? String(data.get(field)) : '';
	const round = text('round');
	const token = text('token');
	const destination = new URL('/conference/award', request.url);
	destination.searchParams.set('round', round);
	destination.searchParams.set('token', token);
	try {
		await decideAward(env, round, token, text('decision'));
	} catch (error) {
		if (error instanceof AwardDecisionError) {
			if (error.status === 409) return new Response(null, { status: 303, headers: { ...headers, Location: destination.href } });
			return new Response(error.message, { status: error.status, headers });
		}
		console.error('Conference award response could not be saved.');
		return new Response('We could not save your response. Please try again.', { status: 503, headers });
	}
	try { await processConferenceSchedule(env); }
	catch { console.error('Conference response saved; notification or replacement pending scheduled retry.'); }
	return new Response(null, { status: 303, headers: { ...headers, Location: destination.href } });
};
