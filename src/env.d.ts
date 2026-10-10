/// <reference types="astro/client" />
/// <reference path="../.astro/worker-configuration.d.ts" />

declare namespace Cloudflare {
	interface Env {
		RESEND_API_KEY: string;
		TURNSTILE_SECRET_KEY: string;
		WEBSITE_LEADS_QUEUE: Queue<WebsiteLeadQueueMessage>;
	}
}

interface WebsiteLeadQueueMessage {
	type: 'website-contact-submitted';
	submissionId: string;
	name: string;
	contact: string;
	vehicle?: string;
	message: string;
	submittedAt: string;
}
