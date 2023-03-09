import {
	type AutocompleteInteraction,
	type CacheType,
	type ChatInputApplicationCommandData,
	type ChatInputCommandInteraction,
	type InteractionResponse,
} from 'discord.js';
import { type Logger } from 'pino';

// TODO implement type
type GlobalInfo = Record<string, unknown>;

// TODO implement type
type GuildInfo = Record<string, unknown>;

/** Responds to a Chat Input Command with global scope */
type GlobalChatInputCommandHandler = (response: GlobalChatInputCommandResponse, logger: Logger, globalInfo: GlobalInfo) => Promise<void>;

/** Responds to an Autocomplete Interaction with global scope */
type GlobalChatInputAutocompleteHandler = (interaction: AutocompleteInteraction, logger: Logger, globalInfo: GlobalInfo) => Promise<void>;

/** Responds to a Chat Input command with guild scope */
type GuildChatInputCommandHandler = (response: GuildChatInputCommandResponse, logger: Logger, guildInfo: GuildInfo, globalInfo: GlobalInfo) => Promise<void>;

/** Responds to an Autocomplete Interaction with guild scope */
type GuildChatInputAutocompleteHandler = (interaction: AutocompleteInteraction, logger: Logger, guildInfo: GuildInfo, globalInfo: GlobalInfo) => Promise<void>;

/** Interaction info for Chat Input Commands */
type ChatInputCommandResponse<T extends CacheType> = Omit<InteractionResponse, 'interaction'> & {
	interaction: ChatInputCommandInteraction<T>;
};

/** Shorthand for a ChatInputCommandResponse with global scope */
type GlobalChatInputCommandResponse = ChatInputCommandResponse<CacheType>;

/** Shorhand for a ChatInputCommandResponse with guild scope */
type GuildChatInputCommandResponse = ChatInputCommandResponse<'cached'>;

/** Command scopes */
type CommandType = 'Global' | 'Guild';

/** Object that defines how the bot handles a Chat Input Command */
type ChatInputCommand<T extends CommandType> = (T extends 'Global'
	? {
			readonly respond: GlobalChatInputCommandHandler;
			readonly autocomplete?: GlobalChatInputAutocompleteHandler;
			readonly type: T;
	  }
	: {
			readonly respond: GuildChatInputCommandHandler;
			readonly autocomplete?: GuildChatInputAutocompleteHandler;
			readonly type: T;
	  }) & {
	readonly data: ChatInputApplicationCommandData;
	readonly ephemeral?: boolean;
	readonly allowedUsers?: string[];
};
