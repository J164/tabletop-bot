import { pino } from 'pino';
import { type BlackjackStats } from '../types/stats.js';
import { Bank } from './bank.js';

type Stats = {
	bank: Bank;
	blackjack?: BlackjackStats;
};

const stats: Record<string, Stats | undefined> = {};
const logger = pino();

export function fetchStats(userId: string): Stats {
	return stats[userId] ?? (stats[userId] = { bank: new Bank() });
}

export function updateStats(userId: string): void {
	logger.info(stats[userId]);
}
