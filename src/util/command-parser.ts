import { readdir } from 'node:fs/promises';
import { type ApplicationCommandHandler } from '../types/client.js';

export async function getApplicationCommands(): Promise<Record<string, ApplicationCommandHandler>> {
	const modules = await readdir('./commands');
	const handlers: Record<string, ApplicationCommandHandler> = {};

	await Promise.all(
		modules.map(async (file) => {
			const { handler } = (await import(`./../commands/${file}`)) as { handler: ApplicationCommandHandler };
			handlers[handler.name] = handler;
		}),
	);

	return handlers;
}
