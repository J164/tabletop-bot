import { type ChatInputCommandHandler } from '../util/command-parser.js';
import { fetchUser } from '../util/user.js';
import { EmbedType, responseOptions } from '../util/response-formatters.js';

export const handler: ChatInputCommandHandler<true> = {
	name: 'daily-reward',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response) {
		const user = fetchUser(response.interaction.user.id);
		const bank = await user.getBank();
		const idleTokenResult = bank.checkIdleTokens();

		await response.interaction.editReply(
			idleTokenResult.success
				? responseOptions(EmbedType.Success, `Redeemed ${idleTokenResult.amount} tokens!`)
				: responseOptions(EmbedType.Error, `Daily reward not ready yet! Check back in ${idleTokenResult.time}`),
		);
	},
};
