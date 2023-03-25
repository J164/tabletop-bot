import { type AutocompleteInteraction, type CacheType, type ChatInputCommandInteraction, type InteractionResponse } from 'discord.js';
import { type Logger } from 'pino';

/** Interaction info for Chat Input Commands */
export type ChatInputCommand<T extends CacheType> = Omit<InteractionResponse, 'interaction'> & {
	interaction: ChatInputCommandInteraction<T>;
};

type GlobalChatInputCommandResponder = (response: GlobalChatInputCommandResponse, logger: Logger) => Promise<void>;
type GlobalChatInputAutocompleteResponder = (interaction: GlobalAutocompleteInteraction, logger: Logger) => Promise<void>;
type GuildChatInputCommandResponder = (response: GuildChatInputCommandResponse, logger: Logger) => Promise<void>;
type GuildChatInputAutocompleteResponder = (interaction: GuildAutocompleteInteraction, logger: Logger) => Promise<void>;

type GlobalChatInputCommandResponse = ChatInputCommand<CacheType>;
type GuildChatInputCommandResponse = ChatInputCommand<'cached'>;

type GlobalAutocompleteInteraction = AutocompleteInteraction;
type GuildAutocompleteInteraction = AutocompleteInteraction<'cached'>;

type CommandContext = 'Global' | 'Guild';

/** Defines how the bot handles an Application Command */
export type ApplicationCommandHandler = ChatInputCommandHandler<CommandContext>;

/** Defines how the bot handles a Global Chat Input Command */
export type ChatInputCommandHandler<T extends CommandContext = 'Global'> = (T extends 'Global'
	? {
			readonly respond: GlobalChatInputCommandResponder;
			readonly autocomplete?: GlobalChatInputAutocompleteResponder;
			readonly allowedInDm: true;
	  }
	: {
			readonly respond: GuildChatInputCommandResponder;
			readonly autocomplete?: GuildChatInputAutocompleteResponder;
			readonly allowedInDm: false;
	  }) & {
	readonly name: string;
	readonly ephemeral?: boolean;
	readonly type: 'chatInputCommand';
};
