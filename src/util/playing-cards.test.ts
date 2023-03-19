import { expect, it, describe } from 'vitest';
import { RankCode, SuitCode } from '../types/cards.js';
import { Card, randomCard } from './playing-cards.js';

describe('randomCard()', () => {
	it('should return a card', () => {
		expect(randomCard()).toBeInstanceOf(Card);
	});
});

describe('Card', () => {
	describe('Card.cardCode', () => {
		it('should return the correct card code', () => {
			const card = new Card(RankCode.Ten, SuitCode.Diamonds);

			expect(card.cardCode).toBe('0D');
		});
	});
});
