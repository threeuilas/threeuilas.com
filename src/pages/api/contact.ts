import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;

	let submissionId: string, name: string, contact: string, vehicle: string, message: string, honeypot: string, turnstileToken: string;

	try {
		const data = await request.formData();
		submissionId = ((data.get('submissionId') as string) ?? '').trim().toLowerCase();
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
	if (!uuidPattern.test(submissionId)) return json({ error: 'Please refresh the page and try again.' }, 400);
	if (!name || name.length > 200) return json({ error: 'Enter a name using 200 characters or fewer.' }, 400);
	if (!contact || contact.length > 254) return json({ error: 'Enter a valid email address or phone number.' }, 400);
	if (contact.includes('@')) {
		if (!emailPattern.test(contact)) return json({ error: 'Enter a valid email address.' }, 400);
	} else if (contact.replace(/\D/g, '').length < 7 || contact.length > 50) {
		return json({ error: 'Enter a valid phone number.' }, 400);
	}
	if (vehicle.length > 150) return json({ error: 'Select a valid vehicle.' }, 400);
	if (!message || message.length > 2_000) return json({ error: 'Enter a message using 2,000 characters or fewer.' }, 400);

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

	const submission: WebsiteLeadQueueMessage = {
		type: 'website-contact-submitted',
		submissionId,
		name,
		contact,
		...(vehicle && { vehicle }),
		message,
		submittedAt: new Date().toISOString(),
	};

	try {
		await env.WEBSITE_LEADS_QUEUE.send(submission);
	} catch (error) {
		console.error('Website lead queue error:', error instanceof Error ? error.message : String(error));
		return json({ error: 'Failed to send message. Please try again or contact us directly.' }, 503);
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

	try {
		const resend = new Resend(env.RESEND_API_KEY);
		const { error } = await resend.emails.send({
			from: 'Three Uilas Contact <contact@submissions.threeuilas.com>',
			to: ['info@threeuilas.com'],
			...(replyTo && { reply_to: replyTo }),
			subject,
			html,
		});
		if (error) console.error('Resend error:', JSON.stringify(error));
	} catch (error) {
		console.error('Resend error:', error instanceof Error ? error.message : String(error));
	}

	return json({ success: true }, 200);
};

function json(body: object, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
