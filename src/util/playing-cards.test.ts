import { expect, it, describe } from 'vitest';
import { ALL_PLAYING_CARDS } from '../../test/cards.js';
import { Card, cardGenerator, randomCard } from './playing-cards.js';

describe('randomCard()', () => {
	it.todo('should return random cards', () => {
		expect(randomCard()).toBeInstanceOf(Card);
	});
});

describe('cardGenerator()', () => {
	it.todo('should return random cards', () => {
		const next = cardGenerator();

		expect(next()).toBeInstanceOf(Card);
	});

	it.todo('should regenerate the deck when exhausted', () => {
		const next = cardGenerator();

		expect(next()).toBeInstanceOf(Card);
	});
});

describe.each(ALL_PLAYING_CARDS)('Card: $card', ({ card, code, rank, suit, color }) => {
	it(`should have code ${code}`, () => {
		expect(card.code).toBe(code);
	});

	it(`should have rankName ${rank}`, () => {
		expect(card.rankName).toBe(rank);
	});

	it(`should have suitname ${suit}`, () => {
		expect(card.suitName).toBe(suit);
	});

	it(`should have color ${color}`, () => {
		expect(card.color).toBe(color);
	});
});

describe.todo('Deck');
