import { type JSONEncodable } from 'discord.js';
import { type BlackjackStats } from '../games/blackjack/game.js';
import { statsCollection } from './database/database.js';
import { Bank, type RawBank } from './bank.js';

export type RawStats = {
	userId: string;
	bank: RawBank;
	blackjack: BlackjackStats | undefined;
};

export class Stats implements JSONEncodable<RawStats> {
	public readonly userId: string;
	public readonly bank: Bank;
	public readonly blackjack: BlackjackStats | undefined;

	public constructor(rawStats: Partial<RawStats> & Pick<RawStats, 'userId'>) {
		const { userId, bank, blackjack } = rawStats;

		this.userId = userId;
		this.bank = new Bank(bank ?? {});
		this.blackjack = blackjack;
	}

	public toJSON(): RawStats {
		return { userId: this.userId, bank: this.bank.toJSON(), blackjack: this.blackjack };
	}
}

const stats: Record<string, Stats | undefined> = {};

export async function fetchStats(userId: string): Promise<Stats> {
	return (stats[userId] ??= new Stats((await statsCollection.findOne()) ?? { userId }));
}

export async function updateStats(userId: string): Promise<void> {
	const user = stats[userId];

	if (user) {
		await statsCollection.updateOne({ userId }, user.toJSON(), { upsert: true });
	}
}
