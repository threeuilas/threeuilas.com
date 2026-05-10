import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;

	let name: string, contact: string, vehicle: string, message: string, honeypot: string, turnstileToken: string;

	try {
		const data = await request.formData();
		name = ((data.get('name') as string) ?? '').trim();
		contact = ((data.get('contact') as string) ?? '').trim();
		vehicle = ((data.get('vehicle') as string) ?? '').trim();
		message = ((data.get('message') as string) ?? '').trim();
		honeypot = ((data.get('website') as string) ?? '').trim();
		turnstileToken = ((data.get('cf-turnstile-response') as string) ?? '').trim();
	} catch {
		return json({ error: 'Invalid request.' }, 400);
	}

	if (honeypot) {
		return json({ error: 'Invalid request.' }, 400);
	}

	if (!turnstileToken) {
		return json({ error: 'Please complete the verification.' }, 400);
	}

	const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			secret: env.TURNSTILE_SECRET_KEY,
			response: turnstileToken,
		}),
	});
	const verifyData = await verifyRes.json() as { success: boolean };
	if (!verifyData.success) {
		return json({ error: 'Verification failed. Please refresh and try again.' }, 400);
	}

	if (!name || !contact || !message) {
		return json({ error: 'Name, contact, and message are required.' }, 400);
	}

	const subject = vehicle ? `Inquiry: ${vehicle}` : 'Contact Form Submission';
	const replyTo = contact.includes('@') ? contact : undefined;

	const html = `
		<p><strong>Name:</strong> ${escapeHtml(name)}</p>
		<p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
		${vehicle ? `<p><strong>Vehicle:</strong> ${escapeHtml(vehicle)}</p>` : ''}
		<p><strong>Message:</strong></p>
		<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
	`;

	const resend = new Resend(env.RESEND_API_KEY);
	const { error } = await resend.emails.send({
		from: 'Three Uilas Contact <contact@submissions.threeuilas.com>',
		to: ['info@threeuilas.com'],
		...(replyTo && { reply_to: replyTo }),
		subject,
		html,
	});

	if (error) {
		console.error('Resend error:', JSON.stringify(error));
		return json({ error: 'Failed to send message. Please try again or contact us directly.' }, 500);
	}

	return json({ success: true }, 200);
};

function json(body: object, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
