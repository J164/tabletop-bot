import { Blackjack } from '../games/blackjack/game.js';
import { type ChatInputCommandHandler } from '../util/command-parser.js';
import { EmbedType, responseOptions } from '../util/response-formatters.js';
import { fetchUser } from '../util/user.js';

export const handler: ChatInputCommandHandler<true> = {
	name: 'blackjack',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response, logger) {
		switch (response.interaction.options.getSubcommand()) {
			case 'play': {
				const user = fetchUser(response.interaction.user.id);

				const [channel, bank, blackjackStats] = await Promise.all([
					response.interaction.user.createDM(),
					user.getBank(),
					user.getBlackjackSave(),
					response.interaction.editReply(responseOptions(EmbedType.Info, 'Starting game...')),
				]);

				const blackjack = new Blackjack(channel, bank, blackjackStats);
				await blackjack.start();
				break;
			}

			default: {
				logger.error(response, 'Unknown subcommand invoked');
				await response.interaction.editReply(responseOptions(EmbedType.Error, 'Something went wrong!'));
				break;
			}
		}
	},
};
