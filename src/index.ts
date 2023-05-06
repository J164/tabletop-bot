import { env } from 'node:process';
import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import { onInteractionCreate } from './event-handlers/interaction-create.js';
import { onReady } from './event-handlers/ready.js';

await new Client({
	intents: [GatewayIntentBits.Guilds],
	partials: [Partials.Channel],
	presence: {
		activities: [{ name: env.STATUS ?? '', type: ActivityType.Playing }],
	},
})
	.once('ready', onReady)
	.on('interactionCreate', onInteractionCreate)
	.login(env.TOKEN);
