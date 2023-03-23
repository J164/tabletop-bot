import { expect, it, describe } from 'vitest';
import { RankCode, SuitCode } from '../types/cards.js';
import { Card, cardGenerator, randomCard } from './playing-cards.js';

const allCards = [
	new Card(RankCode.Ace, SuitCode.Spades),
	new Card(RankCode.Ace, SuitCode.Diamonds),
	new Card(RankCode.Ace, SuitCode.Clubs),
	new Card(RankCode.Ace, SuitCode.Hearts),
	new Card(RankCode.Two, SuitCode.Spades),
	new Card(RankCode.Two, SuitCode.Diamonds),
	new Card(RankCode.Two, SuitCode.Clubs),
	new Card(RankCode.Two, SuitCode.Hearts),
	new Card(RankCode.Three, SuitCode.Spades),
	new Card(RankCode.Three, SuitCode.Diamonds),
	new Card(RankCode.Three, SuitCode.Clubs),
	new Card(RankCode.Three, SuitCode.Hearts),
	new Card(RankCode.Four, SuitCode.Spades),
	new Card(RankCode.Four, SuitCode.Diamonds),
	new Card(RankCode.Four, SuitCode.Clubs),
	new Card(RankCode.Four, SuitCode.Hearts),
	new Card(RankCode.Five, SuitCode.Spades),
	new Card(RankCode.Five, SuitCode.Diamonds),
	new Card(RankCode.Five, SuitCode.Clubs),
	new Card(RankCode.Five, SuitCode.Hearts),
	new Card(RankCode.Six, SuitCode.Spades),
	new Card(RankCode.Six, SuitCode.Diamonds),
	new Card(RankCode.Six, SuitCode.Clubs),
	new Card(RankCode.Six, SuitCode.Hearts),
	new Card(RankCode.Seven, SuitCode.Spades),
	new Card(RankCode.Seven, SuitCode.Diamonds),
	new Card(RankCode.Seven, SuitCode.Clubs),
	new Card(RankCode.Seven, SuitCode.Hearts),
	new Card(RankCode.Eight, SuitCode.Spades),
	new Card(RankCode.Eight, SuitCode.Diamonds),
	new Card(RankCode.Eight, SuitCode.Clubs),
	new Card(RankCode.Eight, SuitCode.Hearts),
	new Card(RankCode.Nine, SuitCode.Spades),
	new Card(RankCode.Nine, SuitCode.Diamonds),
	new Card(RankCode.Nine, SuitCode.Clubs),
	new Card(RankCode.Nine, SuitCode.Hearts),
	new Card(RankCode.Ten, SuitCode.Spades),
	new Card(RankCode.Ten, SuitCode.Diamonds),
	new Card(RankCode.Ten, SuitCode.Clubs),
	new Card(RankCode.Ten, SuitCode.Hearts),
	new Card(RankCode.Jack, SuitCode.Spades),
	new Card(RankCode.Jack, SuitCode.Diamonds),
	new Card(RankCode.Jack, SuitCode.Clubs),
	new Card(RankCode.Jack, SuitCode.Hearts),
	new Card(RankCode.Queen, SuitCode.Spades),
	new Card(RankCode.Queen, SuitCode.Diamonds),
	new Card(RankCode.Queen, SuitCode.Clubs),
	new Card(RankCode.Queen, SuitCode.Hearts),
	new Card(RankCode.King, SuitCode.Spades),
	new Card(RankCode.King, SuitCode.Diamonds),
	new Card(RankCode.King, SuitCode.Clubs),
	new Card(RankCode.King, SuitCode.Hearts),
] as const;

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

describe('Card', () => {
	const cardProperties = [
		{ expectedCode: 'AS', expectedRank: 'ace', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: 'AD', expectedRank: 'ace', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: 'AC', expectedRank: 'ace', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: 'AH', expectedRank: 'ace', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '2S', expectedRank: 'two', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '2D', expectedRank: 'two', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '2C', expectedRank: 'two', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '2H', expectedRank: 'two', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '3S', expectedRank: 'three', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '3D', expectedRank: 'three', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '3C', expectedRank: 'three', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '3H', expectedRank: 'three', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '4S', expectedRank: 'four', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '4D', expectedRank: 'four', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '4C', expectedRank: 'four', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '4H', expectedRank: 'four', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '5S', expectedRank: 'five', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '5D', expectedRank: 'five', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '5C', expectedRank: 'five', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '5H', expectedRank: 'five', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '6S', expectedRank: 'six', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '6D', expectedRank: 'six', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '6C', expectedRank: 'six', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '6H', expectedRank: 'six', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '7S', expectedRank: 'seven', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '7D', expectedRank: 'seven', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '7C', expectedRank: 'seven', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '7H', expectedRank: 'seven', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '8S', expectedRank: 'eight', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '8D', expectedRank: 'eight', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '8C', expectedRank: 'eight', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '8H', expectedRank: 'eight', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '9S', expectedRank: 'nine', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '9D', expectedRank: 'nine', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '9C', expectedRank: 'nine', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '9H', expectedRank: 'nine', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: '0S', expectedRank: 'ten', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: '0D', expectedRank: 'ten', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: '0C', expectedRank: 'ten', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: '0H', expectedRank: 'ten', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: 'JS', expectedRank: 'jack', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: 'JD', expectedRank: 'jack', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: 'JC', expectedRank: 'jack', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: 'JH', expectedRank: 'jack', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: 'QS', expectedRank: 'queen', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: 'QD', expectedRank: 'queen', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: 'QC', expectedRank: 'queen', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: 'QH', expectedRank: 'queen', expectedSuit: 'hearts', expectedColor: 'red' },
		{ expectedCode: 'KS', expectedRank: 'king', expectedSuit: 'spades', expectedColor: 'black' },
		{ expectedCode: 'KD', expectedRank: 'king', expectedSuit: 'diamonds', expectedColor: 'red' },
		{ expectedCode: 'KC', expectedRank: 'king', expectedSuit: 'clubs', expectedColor: 'black' },
		{ expectedCode: 'KH', expectedRank: 'king', expectedSuit: 'hearts', expectedColor: 'red' },
	] as const;

	it('should return the correct computed properties', () => {
		for (const [index, { code, rankName, suitName, color }] of allCards.entries()) {
			const { expectedCode, expectedRank, expectedSuit, expectedColor } = cardProperties[index];

			expect(code).toBe(expectedCode);
			expect(rankName).toBe(expectedRank);
			expect(suitName).toBe(expectedSuit);
			expect(color).toBe(expectedColor);
		}
	});
});
