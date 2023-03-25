import { RankCode } from '../../types/cards.js';

/** Results of a game of blackjack */
export const enum BlackjackResult {
	PlayerBlackjack = 'Player Blackjack',
	DealerBlackjack = 'Dealer Blackjack',
	Bust = 'Bust',
	Win = 'Win',
	Lose = 'Lose',
	Push = 'Push',
}

/**
 * Scores a hand based on the rules of blackjack
 * @param hand The hand to score
 * @returns The score
 */
export function scoreHand(hand: Array<{ rank: RankCode }>): number {
	let numAces = 0;
	let score = 0;

	for (const card of hand) {
		switch (card.rank) {
			case RankCode.Ace: {
				numAces++;
				score += 11;
				break;
			}

			case RankCode.Two: {
				score += 2;
				break;
			}

			case RankCode.Three: {
				score += 3;
				break;
			}

			case RankCode.Four: {
				score += 4;
				break;
			}

			case RankCode.Five: {
				score += 5;
				break;
			}

			case RankCode.Six: {
				score += 6;
				break;
			}

			case RankCode.Seven: {
				score += 7;
				break;
			}

			case RankCode.Eight: {
				score += 8;
				break;
			}

			case RankCode.Nine: {
				score += 9;
				break;
			}

			case RankCode.Ten:
			case RankCode.Jack:
			case RankCode.Queen:
			case RankCode.King: {
				score += 10;
				break;
			}
		}
	}

	while (score > 21 && numAces > 0) {
		numAces--;
		score -= 10;
	}

	return score;
}

/**
 * Determines the result of the game of blackjack
 * @param playerScore The score of the player's hand
 * @param dealerScore The score of the dealer's hand
 * @param blackjack Whether one or both of the players has a blackjack
 * @returns A BlackjackResult
 */
export function determineResults(playerScore: number, dealerScore: number, blackjack: boolean): BlackjackResult {
	if (blackjack) {
		if (playerScore !== 21) {
			return BlackjackResult.DealerBlackjack;
		}

		if (dealerScore !== 21) {
			return BlackjackResult.PlayerBlackjack;
		}

		return BlackjackResult.Push;
	}

	if (playerScore > 21) {
		return BlackjackResult.Bust;
	}

	if (playerScore > dealerScore || dealerScore > 21) {
		return BlackjackResult.Win;
	}

	if (dealerScore > playerScore) {
		return BlackjackResult.Lose;
	}

	return BlackjackResult.Push;
}
