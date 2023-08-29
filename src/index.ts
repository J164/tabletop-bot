import { env } from 'node:process';
import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';
import { startBot } from '@j164/bot-framework';
import { loadApplicationCommands } from './util/load-commands.js';

await startBot({
	token: env.TOKEN ?? '',
	databaseUrl: env.MONGO_URL ?? '',
	clientOptions: {
		intents: [GatewayIntentBits.Guilds],
		partials: [Partials.Channel],
		presence: {
			activities: [{ name: env.STATUS ?? '', type: ActivityType.Playing }],
		},
	},
	commandHandlers: await loadApplicationCommands(),
	taskHandlers: [],
});
