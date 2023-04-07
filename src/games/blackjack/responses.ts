import { type APIEmbed, type AttachmentPayload } from 'discord.js';
import { type CardImageCode, mergeImages } from '../../util/card-images.js';
import { type Card } from '../../util/playing-cards.js';
import { EmbedType, responseEmbed } from '../../util/response-formatters.js';
import { type BlackjackResult, scoreHand } from './logic.js';

type PlayerResult = { hand: Card[]; result: BlackjackResult };

function createHandEmbed(title: string, hand: Card[], imageName: string): APIEmbed {
	return responseEmbed(EmbedType.Info, title, {
		fields: [{ name: 'Value', value: scoreHand(hand).toString(), inline: true }],
		image: { url: `attachment://${imageName}` },
	});
}

async function createHandFile(name: string, cards: Array<{ code: CardImageCode }>): Promise<AttachmentPayload> {
	return {
		name,
		attachment: await mergeImages(
			cards.map((card) => {
				return card.code;
			}),
		),
	};
}

/**
 * Formats the player and dealer's hand into a standings message for before the dealer's full hand is revealed
 * @param playerHand The player's hand
 * @param dealerCard The dealer's faceup card
 * @returns The embeds and image files
 */
export async function printStandings(playerHand: Card[], dealerCard: Card): Promise<{ embeds: APIEmbed[]; files: AttachmentPayload[] }> {
	return {
		embeds: [createHandEmbed('Dealer', [dealerCard], 'dealer.png'), createHandEmbed('Player', playerHand, 'player.png')],
		files: await Promise.all([createHandFile('dealer.png', [dealerCard, { code: 'back' }]), createHandFile('player.png', playerHand)]),
	};
}

/**
 * Formats the player and dealer's hand into a standings message for after the dealer's full hand is revealed
 * @param playerHand The player's hand
 * @param dealerCard The dealer's hand
 * @returns The embeds and image files
 */
export async function printFinalStandings(players: PlayerResult[], dealerHand: Card[]): Promise<{ embeds: APIEmbed[]; files: AttachmentPayload[] }> {
	const embeds = players.map(({ hand, result }, index) => {
		return createHandEmbed(`Player Hand ${index + 1} - ${result}`, hand, `hand${index}.png`);
	});

	embeds.unshift(createHandEmbed('Dealer', dealerHand, 'dealer.png'));

	const files = players.map(async ({ hand }, index) => {
		return createHandFile(`hand${index}.png`, hand);
	});

	files.push(createHandFile('dealer.png', dealerHand));

	return { embeds, files: await Promise.all(files) };
}
