import { randomInt } from 'node:crypto';

/** Valid card codes */
export type CardCode = `${RankCode}${SuitCode}`;
/** Valid card colors */
export type CardColor = 'black' | 'red';

/** Enum representing possible playing card ranks */
export const enum RankCode {
	Ace = 'A',
	Two = '2',
	Three = '3',
	Four = '4',
	Five = '5',
	Six = '6',
	Seven = '7',
	Eight = '8',
	Nine = '9',
	Ten = '0',
	Jack = 'J',
	Queen = 'Q',
	King = 'K',
}

/** Enum representing possible playing card suits */
export const enum SuitCode {
	Spades = 'S',
	Clubs = 'C',
	Hearts = 'H',
	Diamonds = 'D',
}

/** An array of all the valid card ranks */
export const ALL_RANKS = [
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

/** An array of all the valid card suits */
export const ALL_SUITS = [SuitCode.Spades, SuitCode.Clubs, SuitCode.Hearts, SuitCode.Diamonds] as const;

/**
 * Generates a random card
 * @param options Options to customize which cards can be generated
 * @returns A random card
 */
export function randomCard(options?: { ranks?: RankCode[]; suits?: SuitCode[] }): Card {
	const ranks = options?.ranks ?? ALL_RANKS;
	const suits = options?.suits ?? ALL_SUITS;

	return new Card(ranks[randomInt(0, ranks.length)], suits[randomInt(0, suits.length)]);
}

/**
 * Creates a deck, shuffles it, and returns a function that returns a random card. The deck is regenerated and reshuffled when exhausted.
 * @returns A function that returns a random card
 */
export function cardGenerator(): () => Card {
	let deck = new Deck().shuffle();

	return () => {
		if (deck.size === 0) {
			deck = new Deck();
		}

		return deck.drawUnsafe();
	};
}

/** A playing card */
export class Card {
	public constructor(public readonly rank: RankCode, public readonly suit: SuitCode) {}

	public get code(): CardCode {
		return `${this.rank}${this.suit}`;
	}

	public get color(): CardColor {
		switch (this.suit) {
			case SuitCode.Spades:
			case SuitCode.Clubs: {
				return 'black';
			}

			case SuitCode.Hearts:
			case SuitCode.Diamonds: {
				return 'red';
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
		}
	}
}

/** A deck of playing cards */
export class Deck {
	private readonly _cards: Card[] = [];

	public constructor() {
		for (const rank of ALL_RANKS) {
			for (const suit of ALL_SUITS) {
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
			const randomIndex = randomInt(0, index + 1);
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
