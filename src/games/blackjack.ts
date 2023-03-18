import { ButtonStyle, ComponentType, type MessageCreateOptions, type DMChannel } from 'discord.js';
import { type Logger } from 'pino';
import { RankCode } from '../types/cards.js';
import { EmbedType } from '../types/helpers.js';
import { mergeImages } from '../util/card-images.js';
import { Deck, type Card } from '../util/deck.js';
import { messageOptions, responseEmbed } from '../util/response-formatters.js';

export async function startBlackjack(channel: DMChannel, logger: Logger) {
	const deck = new Deck().shuffle();

	const player = [deck.drawUnsafe(), deck.drawUnsafe()];
	const dealer = [deck.drawUnsafe(), deck.drawUnsafe()];

	await promptPlayer(player, dealer, deck, channel);
}

async function promptPlayer(player: Card[], dealer: Card[], deck: Deck, channel: DMChannel) {
	const message = await channel.send(
		messageOptions({
			...(await printStandings(player, dealer)),
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							custom_id: 'hit',
							style: ButtonStyle.Primary,
							label: 'Hit',
						},
						{
							type: ComponentType.Button,
							custom_id: 'stand',
							style: ButtonStyle.Secondary,
							label: 'Stand',
						},
					],
				},
			],
		}),
	);

	const component = await message.awaitMessageComponent({
		componentType: ComponentType.Button,
		time: 300_000,
	});

	await component.update(messageOptions({ components: [] }));

	if (component.customId === 'hit') {
		// TODO: do things and return something?
	}
}

async function printStandings(playerHand: Card[], dealerHand: Card[], playerDone = false): Promise<MessageCreateOptions> {
	return {
		embeds: [
			responseEmbed(EmbedType.Info, 'Player', { fields: [{ name: 'Value', value: scoreHand(playerHand).toString(), inline: true }] }),
			responseEmbed(EmbedType.Info, 'Dealer', {
				fields: [{ name: 'Value', value: scoreHand(playerDone ? [dealerHand[0]] : dealerHand).toString(), inline: true }],
			}),
		],
		files: await Promise.all([
			mergeImages(
				playerHand.map((card) => {
					return card.cardCode;
				}),
			),
			mergeImages(
				(playerDone ? ([dealerHand[0], { cardCode: 'back' }] as const) : dealerHand).map((card) => {
					return card.cardCode;
				}),
			),
		]),
	};
}

function scoreHand(hand: Array<{ rank: RankCode }>): number {
	let numAces = 0;
	let score = 0;

	for (const card of hand) {
		switch (card.rank) {
			case RankCode.Ace: {
				numAces++;
				score += 11;
				break;
			}

			case RankCode.Two: {
				score += 2;
				break;
			}

			case RankCode.Three: {
				score += 3;
				break;
			}

			case RankCode.Four: {
				score += 4;
				break;
			}

			case RankCode.Five: {
				score += 5;
				break;
			}

			case RankCode.Six: {
				score += 6;
				break;
			}

			case RankCode.Seven: {
				score += 7;
				break;
			}

			case RankCode.Eight: {
				score += 8;
				break;
			}

			case RankCode.Nine: {
				score += 9;
				break;
			}

			case RankCode.Ten:
			case RankCode.Jack:
			case RankCode.Queen:
			case RankCode.King: {
				score += 10;
				break;
			}

			default: {
				break;
			}
		}
	}

	while (score > 21 && numAces > 0) {
		numAces--;
		score -= 10;
	}

	return score;
}
