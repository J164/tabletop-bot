import { type Bank } from '../util/bank.js';

export type Stats = {
	userId: string;
	bank: Bank;
	blackjack?: BlackjackStats;
};

export type RawStats = {
	userId: string;
	bank: RawBank;
	blackjack?: BlackjackStats;
};

export type RawBank = {
	tokens: number;
};

/** A user's blackjack stats */
export type BlackjackStats = {
	netMoneyEarned: number;
	wins: number;
	losses: number;
	pushes: number;
	blackjacks: number;
};
