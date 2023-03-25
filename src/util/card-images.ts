import { readdir, readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';
import { type CardCode } from '../types/cards.js';

type CardImageCode = CardCode | 'back' | 'XX' | 'X1' | 'X2';

const CARD_WIDTH = 226;
const CARD_HEIGHT = 314;

const cardImages = await getCardImages();

async function getCardImages(): Promise<Record<CardImageCode, Buffer>> {
	const images: Record<string, Buffer> = {};

	const fileNames = await readdir('./static/img/cards');

	await Promise.all(
		fileNames.map(async (fileName) => {
			images[fileName.slice(0, -4)] = await readFile(`./static/img/cards/${fileName}`);
		}),
	);
	return images;
}

/**
 * Fetches the image for a given card
 * @param code Code for card to fetch image for
 * @returns The image as a png buffer
 */
export function getCardImage(code: CardImageCode): Buffer {
	return Buffer.from(cardImages[code]);
}

/**
 * Merges a number of card images into one image
 * @param cardCodes Array of card codes
 * @param cardsPerRow Number of cards to fit in each row
 * @returns The merged image as a png buffer
 */
export async function mergeImages(cardCodes: CardImageCode[], cardsPerRow?: number): Promise<Buffer> {
	const width = cardsPerRow ?? cardCodes.length;

	let numberInRow = 0;
	let posX = -CARD_WIDTH;
	let posY = 0;

	const images = cardCodes.map((cardCode) => {
		if (numberInRow === width) {
			posX = 0;
			posY += CARD_HEIGHT;
			numberInRow = 1;
		} else {
			posX += CARD_WIDTH;
			numberInRow++;
		}

		return {
			input: getCardImage(cardCode),
			left: posX,
			top: posY,
		};
	});

	return sharp({
		create: {
			width: CARD_WIDTH * width,
			height: posY + CARD_HEIGHT,
			background: { alpha: 0, r: 0, g: 0, b: 0 },
			channels: 3,
		},
	})
		.composite(images)
		.toFormat('png')
		.toBuffer();
}
