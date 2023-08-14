import { type ChatInputCommandHandler, EmbedType, responseOptions } from '@j164/bot-framework';
import { Blackjack } from '../games/blackjack/game.js';
import { fetchUser } from '../util/user.js';

export const handler: ChatInputCommandHandler<true> = {
	name: 'blackjack',
	type: 'chatInputCommand',
	allowedInDm: true,
	async respond(response, context) {
		switch (response.interaction.options.getSubcommand()) {
			case 'play': {
				const user = fetchUser(response.interaction.user.id, context.botClient.globalLogger);

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

			case 'rules': {
				await response.interaction.editReply(
					responseOptions(EmbedType.Info, 'Blackjack', {
						fields: [
							{ name: 'Objective:', value: 'Blackjack is won by having the hand with the highest value not exceeding 21.', inline: true },
							{
								name: 'Rules',
								value: `
								1. The player makes their initial bet before recieving their hand
								2. The player and dealer are dealt a 2-card hand. A two-card hand worth 21 is called a blackjack. A player with a blackjack is paid 3:2 on their bet. If the dealer has a blackjack, the player automatically loses. If both the dealer and player have a blackjack, it's a push (tie)
								3. If neither player has a blackjack, the player takes actions until they bust (the value of their hand exceeds 21) or choose to stand
								4. When the player is done taking actions, the dealer is dealt cards until their hand has a value of at least 17
								`,
							},
							{
								name: 'Player Actions',
								value: `
								The player can make any of the following actions:
								
								1. **Hit:** The player is dealt another card
								2. **Stand:** The player takes no further actions
								3. **Double Down:** The player doubles their bet, is dealt one more card, then stands
								4. **Split:** If the cards in the player's initial hand have the same value, their hand is split into two new hands each with a bet equal to the initial bet.
								`,
							},
							{
								name: 'Hand Scoring',
								value: `
								1. Cards 2 through 10 are worth their face value
								2. Face cards are worth 10
								3. An ace is worth 11 unless this would cause a bust, in which case it is worth 1
								`,
							},
							{
								name: 'Insurance Bet',
								value: `
								Initially, only one of the dealer's two cards in their opening hand is revealed, if that card is an ace, the player can make an insurance bet:

								1. An insurance bet is placed before the dealer announces if they have a blackjack
								2. An insurance bet can be up to half the amount of the player's intial bet
								3. If the dealer has a blackjack, their insurance bet is paid out at 2:1 odds
								4. Otherwise the player loses their insurance bet and the game continues as normal
								`,
							},
							{
								name: 'Outcomes',
								value: `
								1. **Player Blackjack:** Player paid out at 3:2
								2. **Dealer Blackjack:** Player loses bet
								3. **Player Wins:** Player paid out at 1:1
								4. **Dealer Wins:** Player loses bet
								5. **Push:** Player bet is refunded
								`,
							},
						],
						footer: { text: 'Rules derived from\nhttps://www.cs.mcgill.ca/~rwest/wikispeedia/wpcd/wp/b/Blackjack.htm' },
					}),
				);

				break;
			}

			case 'stats': {
				const user = fetchUser(response.interaction.user.id, context.botClient.globalLogger);
				const blackjackSave = await user.getBlackjackSave();

				await response.interaction.editReply(
					responseOptions(EmbedType.Info, `${response.interaction.user.username}'s Blackjack Stats`, {
						fields: [
							{ name: 'Net Money Earned:', value: blackjackSave.netMoneyEarned.toString() },
							{ name: 'Blackjacks:', value: blackjackSave.blackjacks.toString() },
							{ name: 'Wins:', value: blackjackSave.wins.toString() },
							{ name: 'Losses:', value: blackjackSave.losses.toString() },
							{ name: 'Pushes:', value: blackjackSave.pushes.toString() },
						],
					}),
				);

				break;
			}

			default: {
				context.commandLogger.error(response, 'Unknown subcommand invoked');
				await response.interaction.editReply(responseOptions(EmbedType.Error, 'Something went wrong!'));
				break;
			}
		}
	},
};
