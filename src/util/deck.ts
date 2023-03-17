import { type CardCode, RankCode, SuitCode } from '../types/cards.js';

const RANKS = [
	RankCode.Ace,
	RankCode.Two,
	RankCode.Three,
	RankCode.Four,
	RankCode.Five,
	RankCode.Six,
	RankCode.Seven,
	RankCode.Eight,
	RankCode.Nine,
	RankCode.Ten,
	RankCode.Jack,
	RankCode.Queen,
	RankCode.King,
] as const;
const SUITS = [SuitCode.Spades, SuitCode.Clubs, SuitCode.Hearts, SuitCode.Diamonds] as const;

export function randomCard(options?: { ranks?: RankCode[]; suits?: SuitCode[] }): Card {
	const ranks = options?.ranks ?? RANKS;
	const suits = options?.suits ?? SUITS;

	return new Card(ranks[Math.floor(Math.random()) * ranks.length], suits[Math.floor(Math.random()) * suits.length]);
}

export class Card {
	public constructor(public readonly rank: RankCode, public readonly suit: SuitCode) {}

	public get cardCode(): CardCode {
		return `${this.rank}${this.suit}`;
	}

	public get rankName(): string {
		switch (this.rank) {
			case RankCode.Ace: {
				return 'ace';
			}

			case RankCode.Two: {
				return 'two';
			}

			case RankCode.Three: {
				return 'three';
			}

			case RankCode.Four: {
				return 'four';
			}

			case RankCode.Five: {
				return 'five';
			}

			case RankCode.Six: {
				return 'six';
			}

			case RankCode.Seven: {
				return 'seven';
			}

			case RankCode.Eight: {
				return 'eight';
			}

			case RankCode.Nine: {
				return 'nine';
			}

			case RankCode.Ten: {
				return 'ten';
			}

			case RankCode.Jack: {
				return 'jack';
			}

			case RankCode.Queen: {
				return 'queen';
			}

			case RankCode.King: {
				return 'king';
			}

			default: {
				return '';
			}
		}
	}

	public get suitName(): string {
		switch (this.suit) {
			case SuitCode.Spades: {
				return 'spades';
			}

			case SuitCode.Clubs: {
				return 'clubs';
			}

			case SuitCode.Hearts: {
				return 'hearts';
			}

			case SuitCode.Diamonds: {
				return 'diamonds';
			}

			default: {
				return '';
			}
		}
	}
}

export class Deck {}
