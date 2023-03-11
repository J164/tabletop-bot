import { type AutocompleteInteraction, type CacheType, type ChatInputCommandInteraction, type InteractionResponse } from 'discord.js';
import { type Logger } from 'pino';

/** Responds to a Chat Input Command with global scope */
type GlobalChatInputCommandHandler = (response: GlobalChatInputCommandResponse, logger: Logger) => Promise<void>;

/** Responds to an Autocomplete Interaction with global scope */
type GlobalChatInputAutocompleteHandler = (interaction: GlobalAutocompleteInteraction, logger: Logger) => Promise<void>;

/** Responds to a Chat Input command with guild scope */
type GuildChatInputCommandHandler = (response: GuildChatInputCommandResponse, logger: Logger) => Promise<void>;

/** Responds to an Autocomplete Interaction with guild scope */
type GuildChatInputAutocompleteHandler = (interaction: GuildAutocompleteInteraction, logger: Logger) => Promise<void>;

/** Interaction info for Chat Input Commands */
type ChatInputCommandResponse<T extends CacheType> = Omit<InteractionResponse, 'interaction'> & {
	interaction: ChatInputCommandInteraction<T>;
};

/** Shorthand for a ChatInputCommandResponse with global scope */
type GlobalChatInputCommandResponse = ChatInputCommandResponse<CacheType>;

/** Shorthand for a ChatInputCommandResponse with guild scope */
type GuildChatInputCommandResponse = ChatInputCommandResponse<'cached'>;

/** Shorthand for a AutocompleteInteraction with global scope */
type GlobalAutocompleteInteraction = AutocompleteInteraction;

/** Shorthand for a AutocompleteInteraction with guild scope */
type GuildAutocompleteInteraction = AutocompleteInteraction<'cached'>;

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
	readonly ephemeral?: boolean;
	readonly allowedUsers?: string[];
};
