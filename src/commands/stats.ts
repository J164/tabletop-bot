import { type ChatInputCommandHandler, EmbedType, responseOptions } from '@j164/bot-framework';
import { fetchUser } from '../util/user.js';

export const handler: ChatInputCommandHandler<true> = {
	name: 'stats',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response, context) {
		const user = fetchUser(response.interaction.user.id, context.botClient.globalLogger, context.botClient.fetchCollection);
		const bank = await user.getBank();

		await response.interaction.editReply(
			responseOptions(EmbedType.Info, `${response.interaction.user.username}'s Stats`, {
				fields: [
					{ name: 'Tokens:', value: bank.tokens.toString() },
					{ name: 'Cash:', value: bank.cash.toString() },
				],
			}),
		);
	},
};
