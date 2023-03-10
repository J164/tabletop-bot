import {
	type ChatInputCommandInteraction,
	type Interaction,
	type AutocompleteInteraction,
	type MessageContextMenuCommandInteraction,
	type UserContextMenuCommandInteraction,
	type CacheType,
} from 'discord.js';
import { pino } from 'pino';
import { chatInputCommands } from '../commands/chat-input-commands/index.js';
import { type ChatInputCommandResponse } from '../types/client.js';
import { EmbedType } from '../types/helpers.js';
import { responseOptions } from '../util/response-formatters.js';

const logger = pino({
	name: 'interaction-create',
});

export async function onInteractionCreate(interaction: Interaction): Promise<void> {
	if (interaction.isChatInputCommand()) {
		await handleChatInputCommand(interaction);
		return;
	}

	if (interaction.isUserContextMenuCommand()) {
		await handleUserContextMenuCommand(interaction);
		return;
	}

	if (interaction.isMessageContextMenuCommand()) {
		await handleMessageContextMenuCommand(interaction);
		return;
	}

	if (interaction.isAutocomplete()) {
		await handleChatInputAutocomplete(interaction);
		return;
	}

	logger.info(interaction, 'Interaction recieved and not actioned by global event handler');
}

async function handleChatInputCommand(interaction: ChatInputCommandInteraction): Promise<void> {
	const command = chatInputCommands.get(interaction.commandName);

	if (!command) {
		logger.error(interaction, `Could not find handler for Chat Input Command named "${interaction.commandName}"`);
		await interaction.reply(responseOptions(EmbedType.Error, 'Something went wrong!'));
		return;
	}

	if (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) {
		await interaction.reply(responseOptions(EmbedType.Error, 'You are not authorized to use this command!'));
		return;
	}

	const interactionResponse = (await interaction.deferReply({ ephemeral: command.ephemeral ?? false })) as ChatInputCommandResponse<CacheType>;

	const interactionLogger = logger.child({
		type: 'Chat Input Command',
		id: interaction.id,
		commandName: interaction.commandName,
		options: interaction.options,
	});

	interactionLogger.info(interaction, 'Chat Input Command Interaction deferred');

	if (command.type === 'Guild') {
		if (!interaction.inCachedGuild()) {
			await interaction.editReply(responseOptions(EmbedType.Error, 'This command can only be used in a server!'));
			return;
		}

		try {
			await command.respond(interactionResponse as ChatInputCommandResponse<'cached'>, interactionLogger);
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
	const command = chatInputCommands.get(interaction.commandName);

	if (!command?.autocomplete) {
		logger.error(interaction, `Could not find autocomplete handler for Chat Input Command named "${interaction.commandName}"`);
		await interaction.respond([]);
		return;
	}

	if (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) {
		await interaction.respond([]);
		return;
	}

	const interactionLogger = logger.child({
		type: 'Chat Input Autocomplete',
		id: interaction.id,
		commandName: interaction.commandName,
		options: interaction.options,
	});

	if (command.type === 'Guild') {
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

async function handleUserContextMenuCommand(interaction: UserContextMenuCommandInteraction): Promise<void> {}

async function handleMessageContextMenuCommand(interaction: MessageContextMenuCommandInteraction): Promise<void> {}