import { type CardCode, CardRank, CardSuit } from '../types/cards.js';

const SUITS = [CardSuit.Spades, CardSuit.Clubs, CardSuit.Hearts, CardSuit.Diamonds] as const;
const RANKS = [
	CardRank.Ace,
	CardRank.Two,
	CardRank.Three,
	CardRank.Four,
	CardRank.Five,
	CardRank.Six,
	CardRank.Seven,
	CardRank.Eight,
	CardRank.Nine,
	CardRank.Ten,
	CardRank.Jack,
	CardRank.Queen,
	CardRank.King,
] as const;

export function randomCard(options?: { suits?: CardSuit[]; ranks?: CardRank[] }): Card {
	const suits = options?.suits ?? SUITS;
	const ranks = options?.ranks ?? RANKS;

	return new Card(suits[Math.floor(Math.random()) * suits.length], ranks[Math.floor(Math.random() * ranks.length)]);
}

export class Card {
	public constructor(public readonly suit: CardSuit, public readonly rank: CardRank) {}

	public get cardCode(): CardCode {
		return `${this.rank > 10 ? this.rankName[0].toUpperCase() : this.rank === 10 ? '0' : this.rank.toString()}${this.suitName}` as CardCode;
	}

	public get suitName(): string {
		switch (this.suit) {
			case CardSuit.Spades: {
				return 'spades';
			}

			case CardSuit.Clubs: {
				return 'clubs';
			}

			case CardSuit.Hearts: {
				return 'hearts';
			}

			case CardSuit.Diamonds: {
				return 'diamonds';
			}

			default: {
				return '';
			}
		}
	}

	public get rankName(): string {
		switch (this.rank) {
			case CardRank.Ace: {
				return 'ace';
			}

			case CardRank.Two: {
				return 'two';
			}

			case CardRank.Three: {
				return 'three';
			}

			case CardRank.Four: {
				return 'four';
			}

			case CardRank.Five: {
				return 'five';
			}

			case CardRank.Six: {
				return 'six';
			}

			case CardRank.Seven: {
				return 'seven';
			}

			case CardRank.Eight: {
				return 'eight';
			}

			case CardRank.Nine: {
				return 'nine';
			}

			case CardRank.Ten: {
				return 'ten';
			}

			case CardRank.Jack: {
				return 'jack';
			}

			case CardRank.Queen: {
				return 'queen';
			}

			case CardRank.King: {
				return 'king';
			}

			default: {
				return '';
			}
		}
	}
}

export class Deck {}
