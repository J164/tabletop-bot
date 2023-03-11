import { type AutocompleteInteraction, type CacheType, type ChatInputCommandInteraction, type InteractionResponse } from 'discord.js';
import { type Logger } from 'pino';

/** Responds to a Chat Input Command with global scope */
type GlobalChatInputCommandResponder = (response: GlobalChatInputCommandResponse, logger: Logger) => Promise<void>;

/** Responds to an Autocomplete Interaction with global scope */
type GlobalChatInputAutocompleteResponder = (interaction: GlobalAutocompleteInteraction, logger: Logger) => Promise<void>;

/** Responds to a Chat Input command with guild scope */
type GuildChatInputCommandResponder = (response: GuildChatInputCommandResponse, logger: Logger) => Promise<void>;

/** Responds to an Autocomplete Interaction with guild scope */
type GuildChatInputAutocompleteResponder = (interaction: GuildAutocompleteInteraction, logger: Logger) => Promise<void>;

/** Interaction info for Chat Input Commands */
type ChatInputCommand<T extends CacheType> = Omit<InteractionResponse, 'interaction'> & {
	interaction: ChatInputCommandInteraction<T>;
};

/** Shorthand for a ChatInputCommandResponse with global scope */
type GlobalChatInputCommandResponse = ChatInputCommand<CacheType>;

/** Shorthand for a ChatInputCommandResponse with guild scope */
type GuildChatInputCommandResponse = ChatInputCommand<'cached'>;

/** Shorthand for a AutocompleteInteraction with global scope */
type GlobalAutocompleteInteraction = AutocompleteInteraction;

/** Shorthand for a AutocompleteInteraction with guild scope */
type GuildAutocompleteInteraction = AutocompleteInteraction<'cached'>;

/** Possible command contexts */
type CommandContext = 'Global' | 'Guild';

/** Defines how the bot handles an Application Command */
type ApplicationCommandHandler = ChatInputCommandHandler<CommandContext>;

/** Defines how the bot handles a Global Chat Input Command */
type ChatInputCommandHandler<T extends CommandContext> = (T extends 'Global'
	? {
			readonly respond: GlobalChatInputCommandResponder;
			readonly autocomplete?: GlobalChatInputAutocompleteResponder;
			readonly context: T;
	  }
	: {
			readonly respond: GuildChatInputCommandResponder;
			readonly autocomplete?: GuildChatInputAutocompleteResponder;
			readonly context: T;
	  }) & {
	readonly name: string;
	readonly ephemeral?: boolean;
	readonly type: 'chatInputCommand';
};
