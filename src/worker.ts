import { handle } from '@astrojs/cloudflare/handler';
import { processConferenceSchedule } from './lib/conference-server';

export default {
	fetch: handle,
	async scheduled(_controller, env) {
		await processConferenceSchedule(env);
	},
} satisfies ExportedHandler<Cloudflare.Env>;
