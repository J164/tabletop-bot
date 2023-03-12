import { readdir } from 'node:fs/promises';
import { type ApplicationCommandHandler } from '../types/client.js';

export async function getApplicationCommands(): Promise<Map<string, ApplicationCommandHandler>> {
	const modules = await readdir('./commands');
	const handlers = new Map<string, ApplicationCommandHandler>();

	await Promise.all(
		modules.map(async (file) => {
			const { handler } = (await import(`./../commands/${file}`)) as { handler: ApplicationCommandHandler };
			handlers.set(handler.name, handler);
		}),
	);

	return handlers;
}
