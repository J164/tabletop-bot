import { type APIEmbed, type AttachmentPayload } from 'discord.js';
import { EmbedType } from '../../types/helpers.js';
import { mergeImages } from '../../util/card-images.js';
import { type Card } from '../../util/playing-cards.js';
import { responseEmbed } from '../../util/response-formatters.js';
import { type BlackjackResult, scoreHand } from './logic.js';

type PlayerResult = { hand: Card[]; result: BlackjackResult };

export async function printStandings(playerHand: Card[], dealerCard: Card): Promise<{ embeds: APIEmbed[]; files: AttachmentPayload[] }> {
	return {
		embeds: [
			responseEmbed(EmbedType.Info, 'Dealer', {
				fields: [{ name: 'Value', value: scoreHand([dealerCard]).toString(), inline: true }],
				image: { url: 'attachment://dealer.png' },
			}),
			responseEmbed(EmbedType.Info, 'Player', {
				fields: [{ name: 'Value', value: scoreHand(playerHand).toString(), inline: true }],
				image: { url: 'attachment://player.png' },
			}),
		],
		files: await Promise.all([
			{
				name: 'dealer.png',
				attachment: await mergeImages([dealerCard.code, 'back']),
			},
			{
				name: 'player.png',
				attachment: await mergeImages(
					playerHand.map((card) => {
						return card.code;
					}),
				),
			},
		]),
	};
}

export async function printFinalStandings(players: PlayerResult[], dealerHand: Card[]): Promise<{ embeds: APIEmbed[]; files: AttachmentPayload[] }> {
	const dealerScore = scoreHand(dealerHand);

	return {
		embeds: [
			responseEmbed(EmbedType.Info, 'Dealer', {
				fields: [{ name: 'Value', value: dealerScore.toString(), inline: true }],
				image: { url: 'attachment://dealer.png' },
			}),
			...players.map(({ hand, result }, index) => {
				const playerScore = scoreHand(hand);

				return responseEmbed(EmbedType.Info, `Player Hand ${index + 1} - ${result}`, {
					fields: [{ name: 'Value', value: playerScore.toString(), inline: true }],
					image: { url: `attachment://player${index}.png` },
				});
			}),
		],
		files: await Promise.all([
			{
				name: 'dealer.png',
				attachment: await mergeImages(
					dealerHand.map((card) => {
						return card.code;
					}),
				),
			},
			...players.map(async ({ hand }, index) => {
				return {
					name: `hand${index}.png`,
					attachment: await mergeImages(
						hand.map((card) => {
							return card.code;
						}),
					),
				};
			}),
		]),
	};
}
