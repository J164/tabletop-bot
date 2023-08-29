import { type Collection, Double, Int32 } from 'mongodb';
import { type CollectionFetcher } from '@j164/bot-framework';
import { type Logger } from 'pino';
import { BaseDocument } from '../../util/database/base-document.js';
import { BLACKJACK_COLLECTION } from '../../util/database/collection-options.js';

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
	public static async get(userId: string, logger: Logger, fetchCollection: CollectionFetcher): Promise<BlackjackSave> {
		const collection = await fetchCollection<EncodedBlackjack>('blackjack', BLACKJACK_COLLECTION);
		const save = await collection.findOne({ _id: userId });

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
			collection,
			logger,
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

	private constructor(
		{ userId, netMoneyEarned, wins, losses, pushes, blackjacks }: DecodedBlackjack,
		private readonly _collection: Collection<EncodedBlackjack>,
		logger: Logger,
	) {
		super(userId, logger);

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
		await this._collection.updateOne(
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
