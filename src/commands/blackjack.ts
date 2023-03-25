import { startBlackjack } from '../games/blackjack/game.js';
import { type ChatInputCommandHandler } from '../types/client.js';
import { EmbedType } from '../types/helpers.js';
import { responseOptions } from '../util/response-formatters.js';

export const handler: ChatInputCommandHandler = {
	name: 'blackjack',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response, logger) {
		switch (response.interaction.options.getSubcommand()) {
			case 'play': {
				await response.interaction.editReply(responseOptions(EmbedType.Info, 'Starting game...'));
				await startBlackjack(await response.interaction.user.createDM());
				break;
			}

			// TODO: https://www.cs.mcgill.ca/~rwest/wikispeedia/wpcd/wp/b/Blackjack.htm

			default: {
				logger.error(response, 'Unknown subcommand invoked');
				await response.interaction.editReply(responseOptions(EmbedType.Error, 'Something went wrong!'));
				break;
			}
		}
	},
};
