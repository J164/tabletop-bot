import { type RawStats, type Stats } from '../types/stats.js';
import { Bank } from './bank.js';
import { database } from './database.js';

const stats: Record<string, Stats | undefined> = {};
const collection = database.collection<RawStats>('users');

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
	return stats[userId] ?? wrapStats(await collection.findOne()) ?? (stats[userId] = { userId, bank: new Bank() });
}

export async function updateStats(userId: string): Promise<void> {
	await collection.updateOne({ userId }, stats[userId] ?? { userId, bank: new Bank() }, { upsert: true });
}
