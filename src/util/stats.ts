import { BlackjackStats, type EncodedBlackjackStats } from '../games/blackjack/stats.js';
import { type MongodbEncodable, statsCollection } from './database/database.js';
import { Bank, type EncodedBank } from './bank.js';

export type EncodedStats = {
	userId: string;
	bank: EncodedBank;
	blackjack: EncodedBlackjackStats | undefined;
};

export class Stats implements MongodbEncodable<EncodedStats> {
	public readonly userId: string;
	public readonly bank: Bank;
	public readonly blackjackStats: BlackjackStats;

	public constructor({ userId, bank, blackjack }: Partial<EncodedStats> & Pick<EncodedStats, 'userId'>) {
		this.userId = userId;
		this.bank = new Bank(bank ?? {});
		this.blackjackStats = new BlackjackStats(blackjack ?? {});
	}

	public toEncoded(): EncodedStats {
		return { userId: this.userId, bank: this.bank.toEncoded(), blackjack: this.blackjackStats.toEncoded() };
	}
}

const stats: Record<string, Stats | undefined> = {};

export async function fetchStats(userId: string): Promise<Stats> {
	return (stats[userId] ??= new Stats((await statsCollection.findOne()) ?? { userId }));
}

export async function updateStats(userId: string): Promise<void> {
	const user = stats[userId];

	if (user) {
		await statsCollection.updateOne({ userId }, user.toEncoded(), { upsert: true });
	}
}
