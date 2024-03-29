import { expect, it, describe } from 'vitest';
import { Card, Deck, RankCode, SuitCode, cardGenerator, randomCard } from './playing-cards.js';

const ALL_PLAYING_CARDS = [
	{ card: new Card(RankCode.Ace, SuitCode.Spades), code: 'AS', rank: 'ace', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Ace, SuitCode.Diamonds), code: 'AD', rank: 'ace', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Ace, SuitCode.Clubs), code: 'AC', rank: 'ace', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Ace, SuitCode.Hearts), code: 'AH', rank: 'ace', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Two, SuitCode.Spades), code: '2S', rank: 'two', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Two, SuitCode.Diamonds), code: '2D', rank: 'two', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Two, SuitCode.Clubs), code: '2C', rank: 'two', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Two, SuitCode.Hearts), code: '2H', rank: 'two', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Three, SuitCode.Spades), code: '3S', rank: 'three', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Three, SuitCode.Diamonds), code: '3D', rank: 'three', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Three, SuitCode.Clubs), code: '3C', rank: 'three', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Three, SuitCode.Hearts), code: '3H', rank: 'three', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Four, SuitCode.Spades), code: '4S', rank: 'four', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Four, SuitCode.Diamonds), code: '4D', rank: 'four', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Four, SuitCode.Clubs), code: '4C', rank: 'four', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Four, SuitCode.Hearts), code: '4H', rank: 'four', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Five, SuitCode.Spades), code: '5S', rank: 'five', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Five, SuitCode.Diamonds), code: '5D', rank: 'five', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Five, SuitCode.Clubs), code: '5C', rank: 'five', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Five, SuitCode.Hearts), code: '5H', rank: 'five', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Six, SuitCode.Spades), code: '6S', rank: 'six', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Six, SuitCode.Diamonds), code: '6D', rank: 'six', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Six, SuitCode.Clubs), code: '6C', rank: 'six', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Six, SuitCode.Hearts), code: '6H', rank: 'six', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Seven, SuitCode.Spades), code: '7S', rank: 'seven', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Seven, SuitCode.Diamonds), code: '7D', rank: 'seven', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Seven, SuitCode.Clubs), code: '7C', rank: 'seven', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Seven, SuitCode.Hearts), code: '7H', rank: 'seven', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Eight, SuitCode.Spades), code: '8S', rank: 'eight', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Eight, SuitCode.Diamonds), code: '8D', rank: 'eight', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Eight, SuitCode.Clubs), code: '8C', rank: 'eight', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Eight, SuitCode.Hearts), code: '8H', rank: 'eight', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Nine, SuitCode.Spades), code: '9S', rank: 'nine', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Nine, SuitCode.Diamonds), code: '9D', rank: 'nine', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Nine, SuitCode.Clubs), code: '9C', rank: 'nine', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Nine, SuitCode.Hearts), code: '9H', rank: 'nine', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Ten, SuitCode.Spades), code: '0S', rank: 'ten', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Ten, SuitCode.Diamonds), code: '0D', rank: 'ten', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Ten, SuitCode.Clubs), code: '0C', rank: 'ten', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Ten, SuitCode.Hearts), code: '0H', rank: 'ten', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Jack, SuitCode.Spades), code: 'JS', rank: 'jack', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Jack, SuitCode.Diamonds), code: 'JD', rank: 'jack', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Jack, SuitCode.Clubs), code: 'JC', rank: 'jack', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Jack, SuitCode.Hearts), code: 'JH', rank: 'jack', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.Queen, SuitCode.Spades), code: 'QS', rank: 'queen', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.Queen, SuitCode.Diamonds), code: 'QD', rank: 'queen', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.Queen, SuitCode.Clubs), code: 'QC', rank: 'queen', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.Queen, SuitCode.Hearts), code: 'QH', rank: 'queen', suit: 'hearts', color: 'red' },
	{ card: new Card(RankCode.King, SuitCode.Spades), code: 'KS', rank: 'king', suit: 'spades', color: 'black' },
	{ card: new Card(RankCode.King, SuitCode.Diamonds), code: 'KD', rank: 'king', suit: 'diamonds', color: 'red' },
	{ card: new Card(RankCode.King, SuitCode.Clubs), code: 'KC', rank: 'king', suit: 'clubs', color: 'black' },
	{ card: new Card(RankCode.King, SuitCode.Hearts), code: 'KH', rank: 'king', suit: 'hearts', color: 'red' },
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

describe('Deck', () => {
	it('should return the correct size', () => {
		const deck = new Deck();

		expect(deck.size).toBe(52);

		for (let i = 0; i < 3; i++) {
			deck.draw();
		}

		expect(deck.size).toBe(49);
	});

	it('should draw cards until deck is empty', () => {
		const deck = new Deck();

		while (deck.size > 0) {
			expect(deck.draw()).toBeInstanceOf(Card);
		}

		expect(deck.draw()).toBeUndefined();
	});
});
