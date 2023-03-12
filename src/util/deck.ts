import { readdir, readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

type CardCode = `${'2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 'J' | 'Q' | 'K' | 'A'}${'S' | 'C' | 'H' | 'D'}` | 'back' | 'XX' | 'X1' | 'X2' | 'XX';

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
	return images as Record<CardCode, Buffer>;
}

const cardImages = await getCardImages();

export function getCardImage(code: CardCode) {
	return Buffer.from(cardImages[code]);
}
