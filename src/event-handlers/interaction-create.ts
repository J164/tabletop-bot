import { type ChatInputCommandInteraction, type Interaction, type AutocompleteInteraction, type CacheType } from 'discord.js';
import { pino } from 'pino';
import { type ChatInputCommand } from '../types/client.js';
import { EmbedType } from '../types/helpers.js';
import { getApplicationCommands } from '../util/command-parser.js';
import { responseOptions } from '../util/response-formatters.js';

const logger = pino({
	name: 'interaction-create',
});

const commands = await getApplicationCommands();

export async function onInteractionCreate(interaction: Interaction): Promise<void> {
	if (interaction.isChatInputCommand()) {
		await handleChatInputCommand(interaction);
		return;
	}

	if (interaction.isAutocomplete()) {
		await handleChatInputAutocomplete(interaction);
		return;
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

	logger.info(interaction, 'Interaction recieved and not actioned by global event handler');
}

async function handleChatInputCommand(interaction: ChatInputCommandInteraction): Promise<void> {
	const command = commands.get(interaction.commandName);

	if (!command || command.type !== 'chatInputCommand') {
		logger.error(interaction, `Could not find handler for Chat Input Command named "${interaction.commandName}"`);
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

	interactionLogger.info(interaction, 'Chat Input Command Interaction deferred');

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
	const command = commands.get(interaction.commandName);

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
