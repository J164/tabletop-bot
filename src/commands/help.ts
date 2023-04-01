import { type ChatInputCommandHandler } from '../util/command-parser.js';
import { EmbedType, responseOptions } from '../util/response-formatters.js';

export const handler: ChatInputCommandHandler<true> = {
	name: 'help',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response) {
		await response.interaction.editReply(responseOptions(EmbedType.Info, 'Help'));
	},
};
