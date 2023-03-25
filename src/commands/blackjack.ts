import { Blackjack } from '../games/blackjack/game.js';
import { type ChatInputCommandHandler } from '../types/client.js';
import { EmbedType } from '../types/helpers.js';
import { responseOptions } from '../util/response-formatters.js';
import { fetchStats } from '../util/stats.js';

export const handler: ChatInputCommandHandler = {
	name: 'blackjack',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response, logger) {
		switch (response.interaction.options.getSubcommand()) {
			case 'play': {
				const [channel, playerStats] = await Promise.all([
					response.interaction.user.createDM(),
					fetchStats(response.interaction.user.id),
					response.interaction.editReply(responseOptions(EmbedType.Info, 'Starting game...')),
				]);

				const blackjack = new Blackjack(
					channel,
					playerStats.bank,
					playerStats.blackjack ?? { blackjacks: 0, losses: 0, netMoneyEarned: 0, pushes: 0, wins: 0 },
				);
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
