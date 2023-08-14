import { type ChatInputCommandHandler, EmbedType, responseOptions } from '@j164/bot-framework';
import { fetchUser } from '../util/user.js';

export const handler: ChatInputCommandHandler<true> = {
	name: 'daily-reward',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response, context) {
		const user = fetchUser(response.interaction.user.id, context.botClient.globalLogger);
		const bank = await user.getBank();
		const idleTokenResult = bank.checkIdleTokens();

		await response.interaction.editReply(
			idleTokenResult.success
				? responseOptions(EmbedType.Success, `Redeemed ${idleTokenResult.amount} tokens!`)
				: responseOptions(EmbedType.Error, `Daily reward not ready yet! Check back in ${idleTokenResult.time}`),
		);
	},
};
