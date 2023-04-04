import { Long } from 'mongodb';
import { type BlackjackStats } from '../games/blackjack/game.js';
import { database } from './database/database.js';
import { Bank, type RawBank } from './bank.js';

/** A user's stats */
export type Stats = {
	userId: string;
	bank: Bank;
	blackjack?: BlackjackStats;
};

type RawStats = {
	userId: string;
	bank: RawBank;
	blackjack?: BlackjackStats;
};

const stats: Record<string, Stats | undefined> = {};
const collection = database.collection<RawStats>('users');

function getCachedStats(userId: string): Stats {
	return (stats[userId] = { userId, bank: new Bank({ lastCollected: new Date().toISOString(), tokens: 100, cash: Long.fromBigInt(0n) }) });
}

// eslint-disable-next-line @typescript-eslint/ban-types
function wrapStats(rawStats: RawStats | null): Stats | undefined {
	if (!rawStats) {
		return;
	}

	return {
		...rawStats,
		bank: new Bank(rawStats.bank),
	};
}

export async function fetchStats(userId: string): Promise<Stats> {
	return stats[userId] ?? wrapStats(await collection.findOne()) ?? getCachedStats(userId);
}

export async function updateStats(userId: string): Promise<void> {
	await collection.updateOne({ userId }, getCachedStats(userId), { upsert: true });
}
