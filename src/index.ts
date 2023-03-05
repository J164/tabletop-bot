import { env } from 'node:process';
import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import { onInteractionCreate } from './event-handlers/interaction-create.js';

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
	partials: [Partials.Channel],
	presence: {
		activities: [{ name: env.STATUS ?? '', type: ActivityType.Playing }],
	},
});

client.on('interactionCreate', onInteractionCreate);

await client.login(env.TOKEN);
