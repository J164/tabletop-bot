import { type ChatInputCommandHandler, EmbedType, responseOptions } from '@j164/bot-framework';

export const handler: ChatInputCommandHandler<true> = {
	name: 'help',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response) {
		await response.interaction.editReply(responseOptions(EmbedType.Info, 'Help'));
	},
};
