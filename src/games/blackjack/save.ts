import { Int32, Long } from 'mongodb';
import { blackjackCollection } from '../../util/database/database.js';
import { BaseDocument } from '../../util/database/base-document.js';

/** MongoDB encoded blackjack stats */
export type EncodedBlackjack = {
	_id: string;
	stats: {
		netMoneyEarned: Long;
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
		const save = await blackjackCollection.findOne({ _id: userId });

		console.log(save);

		return new BlackjackSave(
			save
				? BlackjackSave._decode(save)
				: {
						userId,
						stats: { netMoneyEarned: 0, wins: 0, losses: 0, pushes: 0, blackjacks: 0 },
				  },
		);
	}

	private static _decode({ _id, stats: { netMoneyEarned, wins, losses, pushes, blackjacks } }: EncodedBlackjack): DecodedBlackjack {
		return {
			userId: _id,
			stats: {
				netMoneyEarned: netMoneyEarned.toNumber(),
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
		console.log(stats);
		this._queueUpdate();
	}

	protected async _update(userId: string): Promise<void> {
		const { netMoneyEarned, wins, losses, pushes, blackjacks } = this._stats;

		await blackjackCollection.updateOne(
			{ _id: userId },
			{
				$set: {
					_id: userId,
					stats: {
						netMoneyEarned: Long.fromNumber(netMoneyEarned),
						wins: new Int32(wins),
						losses: new Int32(losses),
						pushes: new Int32(pushes),
						blackjacks: new Int32(blackjacks),
					},
				},
			},
			{ upsert: true },
		);
	}
}
