type CardCode = `${RankCode}${SuitCode}`;
type CardColor = 'black' | 'red';

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
