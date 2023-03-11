import { type ChatInputCommandHandler, type GlobalChatInputCommandResponse } from '../types/client.js';
import { EmbedType } from '../types/helpers.js';
import { responseOptions } from '../util/response-formatters.js';

async function help(response: GlobalChatInputCommandResponse): Promise<void> {
	await response.interaction.editReply(responseOptions(EmbedType.Info, 'Help'));
}

export const handler: ChatInputCommandHandler<'Global'> = {
	name: 'help',
	respond: help,
	type: 'chatInputCommand',
	context: 'Global',
};
