type RankCode = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 'J' | 'Q' | 'K' | 'A';
type SuitCode = 'S' | 'C' | 'H' | 'D';
type CardCode = `${RankCode}${SuitCode}`;
type CardColor = 'black' | 'red';

/** Enum representing possible playing card suits */
export const enum CardSuit {
	Spades = 'S',
	Clubs = 'C',
	Hearts = 'H',
	Diamonds = 'D',
}

/** Enum representing possible playing card ranks */
export const enum CardRank {
	Two = 2,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Jack,
	Queen,
	King,
	Ace,
}
