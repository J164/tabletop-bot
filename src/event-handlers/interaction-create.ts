import {
	type ChatInputCommandInteraction,
	type Interaction,
	type AutocompleteInteraction,
	type MessageContextMenuCommandInteraction,
	type UserContextMenuCommandInteraction,
} from 'discord.js';
import { pino } from 'pino';

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
		await handleAutocomplete(interaction);
		return;
	}

	logger.info(interaction, `Interaction with id ${interaction.id} recieved and not actioned by global event handler`);
}

async function handleChatInputCommand(interaction: ChatInputCommandInteraction): Promise<void> {}

async function handleUserContextMenuCommand(interaction: UserContextMenuCommandInteraction): Promise<void> {}

async function handleMessageContextMenuCommand(interaction: MessageContextMenuCommandInteraction): Promise<void> {}

async function handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {}
