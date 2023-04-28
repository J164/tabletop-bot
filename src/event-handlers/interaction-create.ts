import { type ChatInputCommandInteraction, type Interaction, type AutocompleteInteraction, type CacheType } from 'discord.js';
import { type ChatInputCommand, getApplicationCommands } from '../util/command-parser.js';
import { EmbedType, responseOptions } from '../util/response-formatters.js';
import { globalLogger } from '../util/logger.js';

const logger = globalLogger.child({
	name: 'interaction-create',
});

const commands = await getApplicationCommands();

/**
 * The callback to execute when the bot recieves an interaction
 * @param interaction The recieved interaction
 * @returns
 */
export async function onInteractionCreate(interaction: Interaction): Promise<void> {
	if (interaction.isChatInputCommand()) {
		await handleChatInputCommand(interaction);
		return;
	}

	if (interaction.isAutocomplete()) {
		await handleChatInputAutocomplete(interaction);
	}

	/* TODO:
	if (interaction.isUserContextMenuCommand()) {
		await handleUserContextMenuCommand(interaction);
		return;
	}

	if (interaction.isMessageContextMenuCommand()) {
		await handleMessageContextMenuCommand(interaction);
		return;
	}
	*/
}

async function handleChatInputCommand(interaction: ChatInputCommandInteraction): Promise<void> {
	const command = commands[interaction.commandName];

	if (!command || command.type !== 'chatInputCommand') {
		logger.error(`Could not find handler for Chat Input Command named "${interaction.commandName}"`);
		await interaction.reply(responseOptions(EmbedType.Error, 'Something went wrong!'));
		return;
	}

	const interactionResponse = (await interaction.deferReply({ ephemeral: command.ephemeral ?? false })) as ChatInputCommand<CacheType>;

	const interactionLogger = logger.child({
		type: 'Chat Input Command',
		id: interaction.id,
		commandName: interaction.commandName,
		options: interaction.options,
	});

	if (!command.allowedInDm) {
		if (!interaction.inCachedGuild()) {
			await interaction.editReply(responseOptions(EmbedType.Error, 'This command can only be used in servers!'));
			return;
		}

		try {
			await command.respond(interactionResponse as ChatInputCommand<'cached'>, interactionLogger);
		} catch (error) {
			await interaction.editReply(responseOptions(EmbedType.Error, 'Something went wrong!'));
			interactionLogger.error(error, 'Chat Input Command Interaction threw an error');
		}

		return;
	}

	try {
		await command.respond(interactionResponse, interactionLogger);
	} catch (error) {
		await interaction.editReply(responseOptions(EmbedType.Error, 'Something went wrong!'));
		interactionLogger.error(error, 'Chat Input Command Interaction threw an error');
	}
}

async function handleChatInputAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
	const command = commands[interaction.commandName];

	if (!command?.autocomplete) {
		logger.error(interaction, `Could not find autocomplete handler for Chat Input Command named "${interaction.commandName}"`);
		await interaction.respond([]);
		return;
	}

	const interactionLogger = logger.child({
		type: 'Chat Input Autocomplete',
		id: interaction.id,
		commandName: interaction.commandName,
		options: interaction.options,
	});

	if (!command.allowedInDm) {
		if (!interaction.inCachedGuild()) {
			await interaction.respond([]);
			return;
		}

		try {
			await command.autocomplete(interaction, interactionLogger);
		} catch (error) {
			interactionLogger.error(error, 'Chat Input Autocomplete threw an error');
		}

		return;
	}

	try {
		await command.autocomplete(interaction, interactionLogger);
	} catch (error) {
		interactionLogger.error(error, 'Chat Input Autocomplete threw an error');
	}
}

/* TODO:
async function handleUserContextMenuCommand(interaction: UserContextMenuCommandInteraction): Promise<void> {}

async function handleMessageContextMenuCommand(interaction: MessageContextMenuCommandInteraction): Promise<void> {}
*/
