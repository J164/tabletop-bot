import { type ChatInputCommandHandler } from '../util/command-parser.js';
import { EmbedType, responseOptions } from '../util/response-formatters.js';
import { fetchUser } from '../util/user.js';

export const handler: ChatInputCommandHandler<true> = {
	name: 'stats',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response) {
		const user = fetchUser(response.interaction.user.id);
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
