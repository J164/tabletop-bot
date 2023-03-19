import { type CardCode, RankCode, SuitCode, type CardColor } from '../types/cards.js';

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

export function* generateCards(): Generator<Card, never> {
	const deck = new Deck().shuffle();

	while (deck.size > 0) {
		yield deck.drawUnsafe();
	}

	yield* generateCards();

	throw new Error('unreachable');
}

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

	public get cardColor(): CardColor {
		switch (this.suit) {
			case SuitCode.Spades:
			case SuitCode.Clubs: {
				return 'black';
			}

			case SuitCode.Hearts:
			case SuitCode.Diamonds: {
				return 'red';
			}

			default: {
				throw new Error('Invalid card state');
			}
		}
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
				throw new Error('Invalid card state');
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
				throw new Error('Invalid card state');
			}
		}
	}
}

/** Represents a deck of playing cards */
export class Deck {
	private readonly _cards: Card[] = [];

	public constructor() {
		for (const rank of RANKS) {
			for (const suit of SUITS) {
				this._cards.push(new Card(rank, suit));
			}
		}
	}

	public get size(): number {
		return this._cards.length;
	}

	/**
	 * Randomizes the order of cards in the deck
	 * @returns The Deck instance
	 */
	public shuffle(): this {
		for (let index = this._cards.length - 1; index > 0; index--) {
			const randomIndex = Math.floor(Math.random() * (index + 1));
			[this._cards[index], this._cards[randomIndex]] = [this._cards[randomIndex], this._cards[index]];
		}

		return this;
	}

	/**
	 * Removes a card from the deck and returns it
	 * @returns The drawn card or undefined if the deck is empty
	 */
	public draw(): Card | undefined {
		return this._cards.pop();
	}

	/**
	 * Removes a card from the deck and returns it. May result in invalid state if called when the deck is empty.
	 * @returns The drawn card
	 */
	public drawUnsafe(): Card {
		return this._cards.pop()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
	}
}
