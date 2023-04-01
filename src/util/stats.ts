import { type BlackjackStats } from '../types/stats.js';
import { Bank } from './bank.js';
import { database } from './database.js';

type Stats = {
	userId: string;
	bank: Bank;
	blackjack?: BlackjackStats;
};

const stats: Record<string, Stats | undefined> = {};
const collection = database.collection<Stats>('users');

export async function fetchStats(userId: string): Promise<Stats> {
	return stats[userId] ?? (await collection.findOne()) ?? (stats[userId] = { userId, bank: new Bank() });
}

export async function updateStats(userId: string): Promise<void> {
	await collection.updateOne({ userId }, stats[userId] ?? { userId, bank: new Bank() }, { upsert: true });
}
