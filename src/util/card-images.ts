import { readdir, readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';
import { type CardCode } from '../types/cards.js';

type CardImageCode = CardCode | 'back' | 'XX' | 'X1' | 'X2';

async function getCardImages() {
	const images: Record<string, Buffer> = {};

	const fileNames = await readdir('./static/img/cards', {
		withFileTypes: false,
	});

	await Promise.all(
		fileNames.map(async (fileName) => {
			images[fileName] = await readFile(`${fileName}.png`);
		}),
	);
	return images as Record<CardImageCode, Buffer>;
}

const cardImages = await getCardImages();

export function getCardImage(code: CardImageCode) {
	return Buffer.from(cardImages[code]);
}

const CARD_WIDTH = 226;
const CARD_HEIGHT = 314;

/**
 * Merges a number of card images into one image
 * @param cardCodes Array of card codes
 * @param width Number of cards to fit in each row
 * @returns A Promise that resolves to the merged image as a png buffer
 */
export async function mergeImages(cardCodes: CardImageCode[], width: number): Promise<Buffer> {
	let numberInRow = 0;
	let posX = 0;
	let posY = 0;

	const images = cardCodes.map((cardCode) => {
		let x;

		if (numberInRow === width) {
			x = 0;
			posX = CARD_WIDTH;
			posY += CARD_HEIGHT;
			numberInRow = 0;
		} else {
			x = posX;
			posX += CARD_WIDTH;
			numberInRow++;
		}

		return {
			input: getCardImage(cardCode),
			left: x,
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
