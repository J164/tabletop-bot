import { pino } from 'pino';
import { type BlackjackStats } from '../types/stats.js';

type Stats = {
	blackjack?: BlackjackStats;
};

const stats: Record<string, Stats | undefined> = {};
const logger = pino();

export function fetchStats(userId: string): Stats {
	return stats[userId] ?? (stats[userId] = {});
}

export function updateStats(userId: string): void {
	logger.info(stats[userId]);
}
