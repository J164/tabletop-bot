import { Double, Int32 } from 'mongodb';
import { blackjackCollection } from '../../util/database/database.js';
import { BaseDocument } from '../../util/database/base-document.js';

/** MongoDB encoded blackjack stats */
export type EncodedBlackjack = {
	_id: string;
	netMoneyEarned: Double;
	wins: Int32;
	losses: Int32;
	pushes: Int32;
	blackjacks: Int32;
};

type DecodedBlackjack = {
	userId: string;
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

		return new BlackjackSave(
			save
				? BlackjackSave._decode(save)
				: {
						userId,
						netMoneyEarned: 0,
						wins: 0,
						losses: 0,
						pushes: 0,
						blackjacks: 0,
				  },
		);
	}

	private static _decode({ _id, netMoneyEarned, wins, losses, pushes, blackjacks }: EncodedBlackjack): DecodedBlackjack {
		return {
			userId: _id,
			netMoneyEarned: netMoneyEarned.toJSON(),
			wins: wins.toJSON(),
			losses: losses.toJSON(),
			pushes: pushes.toJSON(),
			blackjacks: blackjacks.toJSON(),
		};
	}

	private _netMoneyEarned: number;
	private _wins: number;
	private _losses: number;
	private _pushes: number;
	private _blackjacks: number;

	private constructor({ userId, netMoneyEarned, wins, losses, pushes, blackjacks }: DecodedBlackjack) {
		super(userId);

		this._netMoneyEarned = netMoneyEarned;
		this._wins = wins;
		this._losses = losses;
		this._pushes = pushes;
		this._blackjacks = blackjacks;
	}

	public get netMoneyEarned(): number {
		return this._netMoneyEarned;
	}

	public set netMoneyEarned(netMoneyEarned: number) {
		this._netMoneyEarned = netMoneyEarned;
		this._queueUpdate();
	}

	public get wins(): number {
		return this._wins;
	}

	public set wins(wins: number) {
		this._wins = wins;
		this._queueUpdate();
	}

	public get losses(): number {
		return this._losses;
	}

	public set losses(losses: number) {
		this._losses = losses;
		this._queueUpdate();
	}

	public get pushes(): number {
		return this._pushes;
	}

	public set pushes(pushes: number) {
		this._pushes = pushes;
		this._queueUpdate();
	}

	public get blackjacks(): number {
		return this._blackjacks;
	}

	public set blackjacks(blackjacks: number) {
		this._blackjacks = blackjacks;
		this._queueUpdate();
	}

	protected async _update(userId: string): Promise<void> {
		await blackjackCollection.updateOne(
			{ _id: userId },
			{
				$set: {
					_id: userId,
					netMoneyEarned: new Double(this._netMoneyEarned),
					wins: new Int32(this._wins),
					losses: new Int32(this._losses),
					pushes: new Int32(this._pushes),
					blackjacks: new Int32(this._blackjacks),
				},
			},
			{ upsert: true },
		);
	}
}
