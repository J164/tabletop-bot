import { readdir } from 'node:fs/promises';
import { type CacheType, type InteractionResponse, type ChatInputCommandInteraction, type AutocompleteInteraction } from 'discord.js';
import { type Logger } from 'pino';

/** Interaction info for Chat Input Commands */
export type ChatInputCommand<T extends CacheType> = Omit<InteractionResponse, 'interaction'> & {
	interaction: ChatInputCommandInteraction<T>;
};

/** Defines how the bot handles an Application Command */
export type ApplicationCommandHandler = ChatInputCommandHandler<boolean>;

/** Defines how the bot handles a Global Chat Input Command */
export type ChatInputCommandHandler<T extends boolean> = {
	readonly respond: (response: ChatInputCommand<T extends true ? CacheType : 'cached'>, logger: Logger) => Promise<void>;
	readonly autocomplete?: (interaction: AutocompleteInteraction<T extends true ? CacheType : 'cached'>, logger: Logger) => Promise<void>;
	readonly allowedInDm: T;
	readonly name: string;
	readonly ephemeral?: boolean;
	readonly type: 'chatInputCommand';
};

/**
 * Imports the handlers for application commands
 * @returns A record of ApplicationCommandHandlers mapped to the names of the commands
 */
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
