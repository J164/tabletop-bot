import { ButtonStyle, ComponentType, type DMChannel } from 'discord.js';
import { RankCode } from '../types/cards.js';
import { EmbedType } from '../types/helpers.js';
import { mergeImages } from '../util/card-images.js';
import { cardGenerator, type Card } from '../util/playing-cards.js';
import { messageOptions, responseEmbed } from '../util/response-formatters.js';

export async function startBlackjack(channel: DMChannel) {
	const nextCard = cardGenerator();

	const player = [nextCard(), nextCard()];
	const dealer = [nextCard(), nextCard()];

	await promptPlayer(player, dealer, nextCard, channel);

	let dealerScore = scoreHand(dealer);
	while (dealerScore < 17) {
		dealer.push(nextCard());
		dealerScore = scoreHand(dealer);
	}

	const playerScore = scoreHand(player);

	let result;
	if (playerScore > 21) {
		result = 'Bust!';
	} else if (playerScore === 21) {
		result = 'Blackjack!';
	} else if (playerScore === dealerScore) {
		result = 'Push!';
	} else if (playerScore > dealerScore || dealerScore > 21) {
		result = 'Win!';
	} else {
		result = 'Lose!';
	}

	const { embeds, files } = await printStandings(player, dealer, true);

	const message = await channel.send(
		messageOptions({
			embeds: [responseEmbed(EmbedType.Info, result), ...embeds],
			files,
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							custom_id: 'continue',
							label: 'Play Again?',
							style: ButtonStyle.Primary,
						},
						{
							type: ComponentType.Button,
							custom_id: 'end',
							label: 'Cash Out',
							style: ButtonStyle.Secondary,
						},
					],
				},
			],
		}),
	);

	let component;
	try {
		component = await message.awaitMessageComponent({
			componentType: ComponentType.Button,
			time: 300_000,
		});
	} catch {
		await message.edit({ components: [] });
		return;
	}

	await component.update({ components: [] });

	if (component.customId === 'continue') {
		await startBlackjack(channel);
	}
}

async function promptPlayer(player: Card[], dealer: Card[], nextCard: () => Card, channel: DMChannel) {
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

	let component;
	try {
		component = await message.awaitMessageComponent({
			componentType: ComponentType.Button,
			time: 300_000,
		});
	} catch {
		await message.edit(messageOptions({ components: [] }));
		return;
	}

	await component.update(messageOptions({ components: [] }));

	if (component.customId === 'hit') {
		player.push(nextCard());

		if (scoreHand(player) > 21) {
			return;
		}

		await promptPlayer(player, dealer, nextCard, channel);
	}
}

async function printStandings(playerHand: Card[], dealerHand: Card[], playerDone = false) {
	return {
		embeds: [
			responseEmbed(EmbedType.Info, 'Player', {
				fields: [{ name: 'Value', value: scoreHand(playerHand).toString(), inline: true }],
				image: { url: 'attachment://player.png' },
			}),
			responseEmbed(EmbedType.Info, 'Dealer', {
				fields: [{ name: 'Value', value: scoreHand(playerDone ? dealerHand : [dealerHand[0]]).toString(), inline: true }],
				image: { url: 'attachment://dealer.png' },
			}),
		],
		files: await Promise.all([
			{
				name: 'player.png',
				attachment: await mergeImages(
					playerHand.map((card) => {
						return card.cardCode;
					}),
				),
			},
			{
				name: 'dealer.png',
				attachment: await mergeImages(
					(playerDone ? dealerHand : ([dealerHand[0], { cardCode: 'back' }] as const)).map((card) => {
						return card.cardCode;
					}),
				),
			},
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
