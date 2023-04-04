import { describe, expect, it } from 'vitest';
import { ALL_RANKS, Card, RankCode, SuitCode } from '../../util/playing-cards.js';
import { determineResults, scoreHand } from './logic.js';

describe('scoreHand()', () => {
	const EXPECTED_SCORES = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

	it.each(
		ALL_RANKS.map((rank, index) => {
			return { rank, expectedScore: EXPECTED_SCORES[index] };
		}),
	)('should return the correct score for rank $rank', ({ rank, expectedScore }) => {
		expect(scoreHand([new Card(rank, SuitCode.Spades)])).toBe(expectedScore);
	});

	it('should return the correct score in the special case for aces', () => {
		expect(scoreHand([new Card(RankCode.King, SuitCode.Spades), new Card(RankCode.Ace, SuitCode.Spades)])).toBe(21);
		expect(scoreHand([new Card(RankCode.Ace, SuitCode.Spades), new Card(RankCode.Ace, SuitCode.Spades)])).toBe(12);
		expect(scoreHand([new Card(RankCode.Seven, SuitCode.Spades), new Card(RankCode.Ace, SuitCode.Spades)])).toBe(18);
	});
});

describe('determineResults()', () => {
	it("should return 'Dealer Blackjack' if the dealer starts with 21", () => {
		expect(determineResults(7, 21, true)).toBe('Dealer Blackjack');
	});

	it("should return 'Player Blackjack' if the player starts with 21", () => {
		expect(determineResults(21, 7, true)).toBe('Player Blackjack');
	});

	it("should return 'Push' if both the player and dealer start with 21", () => {
		expect(determineResults(21, 21, true)).toBe('Push');
	});

	it("should return 'Bust' if the player has more than 21", () => {
		expect(determineResults(22, 12, false)).toBe('Bust');
	});

	it("should return 'Win' if the player has a higher score than the dealer or the dealer has more than 21", () => {
		expect(determineResults(20, 18, false)).toBe('Win');
		expect(determineResults(8, 22, false)).toBe('Win');
	});

	it("should return 'Lose' if the dealer has a higher score than the player", () => {
		expect(determineResults(14, 18, false)).toBe('Lose');
	});

	it("should return 'Push' if the player and dealer have the same score", () => {
		expect(determineResults(18, 18, false)).toBe('Push');
	});
});
