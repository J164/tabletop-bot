import { Int32 } from 'mongodb';
import { blackjackCollection } from '../../util/database/database.js';
import { BaseDocument } from '../../util/database/base-document.js';

/** MongoDB encoded blackjack stats */
export type EncodedBlackjack = {
	userId: string;
	stats: {
		netMoneyEarned: Int32;
		wins: Int32;
		losses: Int32;
		pushes: Int32;
		blackjacks: Int32;
	};
};

type DecodedBlackjack = {
	userId: string;
	stats: BlackjackStats;
};

type BlackjackStats = {
	netMoneyEarned: number;
	wins: number;
	losses: number;
	pushes: number;
	blackjacks: number;
};

/** A user's blackjack stats */
export class BlackjackSave extends BaseDocument {
	public static async get(userId: string): Promise<BlackjackSave> {
		const save = await blackjackCollection.findOne({ userId });

		return new BlackjackSave(
			save
				? BlackjackSave._decode(save)
				: {
						userId,
						stats: { netMoneyEarned: 0, wins: 0, losses: 0, pushes: 0, blackjacks: 0 },
				  },
		);
	}

	private static _decode({ userId, stats: { netMoneyEarned, wins, losses, pushes, blackjacks } }: EncodedBlackjack): DecodedBlackjack {
		return {
			userId,
			stats: {
				netMoneyEarned: netMoneyEarned.toJSON(),
				wins: wins.toJSON(),
				losses: losses.toJSON(),
				pushes: pushes.toJSON(),
				blackjacks: blackjacks.toJSON(),
			},
		};
	}

	private _stats: BlackjackStats;

	private constructor({ userId, stats }: DecodedBlackjack) {
		super(userId);

		this._stats = stats;
	}

	public get stats(): BlackjackStats {
		return this._stats;
	}

	public set stats(stats: BlackjackStats) {
		this._stats = stats;
		this._queueUpdate();
	}

	protected async _update(userId: string): Promise<void> {
		const { netMoneyEarned, wins, losses, pushes, blackjacks } = this._stats;

		await blackjackCollection.updateOne(
			{ userId },
			{
				userId,
				stats: {
					netMoneyEarned: new Int32(netMoneyEarned),
					wins: new Int32(wins),
					losses: new Int32(losses),
					pushes: new Int32(pushes),
					blackjacks: new Int32(blackjacks),
				},
			},
			{ upsert: true },
		);
	}
}
