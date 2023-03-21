import { expect, it, describe } from 'vitest';
import { RankCode, SuitCode } from '../types/cards.js';
import { Card, randomCard } from './playing-cards.js';

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
	it('should return a card', () => {
		// TODO: mock random number generator for this test
		expect(randomCard()).toBeInstanceOf(Card);
	});
});

describe('Card', () => {
	const cardProperties = [
		{ code: 'AS', rank: 'ace', suit: 'spades', color: 'black' },
		{ code: 'AD', rank: 'ace', suit: 'diamonds', color: 'red' },
		{ code: 'AC', rank: 'ace', suit: 'clubs', color: 'black' },
		{ code: 'AH', rank: 'ace', suit: 'hearts', color: 'red' },
		{ code: '2S', rank: 'two', suit: 'spades', color: 'black' },
		{ code: '2D', rank: 'two', suit: 'diamonds', color: 'red' },
		{ code: '2C', rank: 'two', suit: 'clubs', color: 'black' },
		{ code: '2H', rank: 'two', suit: 'hearts', color: 'red' },
		{ code: '3S', rank: 'three', suit: 'spades', color: 'black' },
		{ code: '3D', rank: 'three', suit: 'diamonds', color: 'red' },
		{ code: '3C', rank: 'three', suit: 'clubs', color: 'black' },
		{ code: '3H', rank: 'three', suit: 'hearts', color: 'red' },
		{ code: '4S', rank: 'four', suit: 'spades', color: 'black' },
		{ code: '4D', rank: 'four', suit: 'diamonds', color: 'red' },
		{ code: '4C', rank: 'four', suit: 'clubs', color: 'black' },
		{ code: '4H', rank: 'four', suit: 'hearts', color: 'red' },
		{ code: '5S', rank: 'five', suit: 'spades', color: 'black' },
		{ code: '5D', rank: 'five', suit: 'diamonds', color: 'red' },
		{ code: '5C', rank: 'five', suit: 'clubs', color: 'black' },
		{ code: '5H', rank: 'five', suit: 'hearts', color: 'red' },
		{ code: '6S', rank: 'six', suit: 'spades', color: 'black' },
		{ code: '6D', rank: 'six', suit: 'diamonds', color: 'red' },
		{ code: '6C', rank: 'six', suit: 'clubs', color: 'black' },
		{ code: '6H', rank: 'six', suit: 'hearts', color: 'red' },
		{ code: '7S', rank: 'seven', suit: 'spades', color: 'black' },
		{ code: '7D', rank: 'seven', suit: 'diamonds', color: 'red' },
		{ code: '7C', rank: 'seven', suit: 'clubs', color: 'black' },
		{ code: '7H', rank: 'seven', suit: 'hearts', color: 'red' },
		{ code: '8S', rank: 'eight', suit: 'spades', color: 'black' },
		{ code: '8D', rank: 'eight', suit: 'diamonds', color: 'red' },
		{ code: '8C', rank: 'eight', suit: 'clubs', color: 'black' },
		{ code: '8H', rank: 'eight', suit: 'hearts', color: 'red' },
		{ code: '9S', rank: 'nine', suit: 'spades', color: 'black' },
		{ code: '9D', rank: 'nine', suit: 'diamonds', color: 'red' },
		{ code: '9C', rank: 'nine', suit: 'clubs', color: 'black' },
		{ code: '9H', rank: 'nine', suit: 'hearts', color: 'red' },
		{ code: '0S', rank: 'ten', suit: 'spades', color: 'black' },
		{ code: '0D', rank: 'ten', suit: 'diamonds', color: 'red' },
		{ code: '0C', rank: 'ten', suit: 'clubs', color: 'black' },
		{ code: '0H', rank: 'ten', suit: 'hearts', color: 'red' },
		{ code: 'JS', rank: 'jack', suit: 'spades', color: 'black' },
		{ code: 'JD', rank: 'jack', suit: 'diamonds', color: 'red' },
		{ code: 'JC', rank: 'jack', suit: 'clubs', color: 'black' },
		{ code: 'JH', rank: 'jack', suit: 'hearts', color: 'red' },
		{ code: 'QS', rank: 'queen', suit: 'spades', color: 'black' },
		{ code: 'QD', rank: 'queen', suit: 'diamonds', color: 'red' },
		{ code: 'QC', rank: 'queen', suit: 'clubs', color: 'black' },
		{ code: 'QH', rank: 'queen', suit: 'hearts', color: 'red' },
		{ code: 'KS', rank: 'king', suit: 'spades', color: 'black' },
		{ code: 'KD', rank: 'king', suit: 'diamonds', color: 'red' },
		{ code: 'KC', rank: 'king', suit: 'clubs', color: 'black' },
		{ code: 'KH', rank: 'king', suit: 'hearts', color: 'red' },
	] as const;

	it('should return the correct computed properties', () => {
		for (const [index, card] of allCards.entries()) {
			const { code, rank, suit, color } = cardProperties[index];

			expect(card.cardCode).toBe(code);
			expect(card.rankName).toBe(rank);
			expect(card.suitName).toBe(suit);
			expect(card.cardColor).toBe(color);
		}
	});

	it('should throw when state is invalid', () => {
		// @ts-expect-error set invalid state for the card object
		const card = new Card('foo', 'bar');

		expect(() => card.rankName).toThrow('Invalid card state');
		expect(() => card.suitName).toThrow('Invalid card state');
		expect(() => card.cardColor).toThrow('Invalid card state');
	});
});
