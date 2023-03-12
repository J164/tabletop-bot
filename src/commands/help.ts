import { type ChatInputCommandHandler } from '../types/client.js';
import { EmbedType } from '../types/helpers.js';
import { responseOptions } from '../util/response-formatters.js';

export const handler: ChatInputCommandHandler = {
	name: 'help',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response) {
		await response.interaction.editReply(responseOptions(EmbedType.Info, 'Help'));
	},
};
