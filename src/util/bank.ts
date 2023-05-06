import { Int32, Long } from 'mongodb';
import { bankCollection } from './database/database.js';
import { BaseDocument } from './database/base-document.js';

/** MongoDB encoded Bank */
export type EncodedBank = {
	_id: string;
	lastCollected: Long;
	tokens: Int32;
	cash: Long;
};

type DecodedBank = {
	userId: string;
	lastCollected: number;
	tokens: number;
	cash: number;
};

type IdleCheckResult = { success: true; amount: number } | { success: false; time: string };

const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;
const ONE_HOUR_IN_MILLISECONDS = 60 * ONE_MINUTE_IN_MILLISECONDS;
const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 24 * ONE_HOUR_IN_MILLISECONDS;
/** The number of tokens rewarded per day to a player's bank account */
const DAILY_TOKENS = 50;

/** A user's bank */
export class Bank extends BaseDocument {
	/**
	 * Get the user's bank from the cache or database. Creates a new bank if none is found
	 * @param userId The user's Discord id
	 * @returns The user's bank
	 */
	public static async get(userId: string): Promise<Bank> {
		const bank = await bankCollection.findOne({ _id: userId });

		return new Bank(
			bank
				? Bank._decode(bank)
				: {
						userId,
						lastCollected: Date.now(),
						tokens: 100,
						cash: 0,
				  },
		);
	}

	private static _decode({ _id, lastCollected, tokens, cash }: EncodedBank): DecodedBank {
		return {
			userId: _id,
			lastCollected: lastCollected.toNumber(),
			tokens: tokens.toJSON(),
			cash: cash.toNumber(),
		};
	}

	private _lastCollected: number;
	private _tokens: number;
	private _cash: number;

	public constructor({ userId, lastCollected, tokens, cash }: DecodedBank) {
		super(userId);

		this._lastCollected = lastCollected;
		this._tokens = tokens;
		this._cash = cash;
	}

	public get lastCollected(): Date {
		return new Date(this._lastCollected);
	}

	public get tokens(): number {
		return this._tokens;
	}

	public get cash(): number {
		return this._cash;
	}

	public set cash(cash: number) {
		this._cash = cash;
		this._queueUpdate();
	}

	/**
	 * Removes a number of tokens from the bank if the bank has enough tokens
	 * @param amount The amount of tokens to remove
	 * @returns Whether the operation succeeded
	 */
	public chargeTokens(amount: number): boolean {
		if (this._tokens > amount) {
			this._tokens -= amount;
			this._queueUpdate();
			return true;
		}

		return false;
	}

	/**
	 * Collects daily token rewards
	 * @returns The number of tokens cashed in
	 */
	public checkIdleTokens(): IdleCheckResult {
		const now = Date.now();
		const idleTime = now - this._lastCollected;

		if (idleTime < TWENTY_FOUR_HOURS_IN_MILLISECONDS) {
			return {
				success: false,
				time: `${Math.floor(idleTime / ONE_HOUR_IN_MILLISECONDS)}H ${Math.floor((idleTime % ONE_HOUR_IN_MILLISECONDS) / ONE_MINUTE_IN_MILLISECONDS)}M`,
			};
		}

		this._lastCollected = now - (idleTime % TWENTY_FOUR_HOURS_IN_MILLISECONDS);

		const idleTokens = Math.floor(idleTime / TWENTY_FOUR_HOURS_IN_MILLISECONDS) * DAILY_TOKENS;
		this._tokens += idleTokens;

		this._queueUpdate();

		return {
			success: true,
			amount: idleTokens,
		};
	}

	protected async _update(userId: string): Promise<void> {
		await bankCollection.updateOne(
			{ _id: userId },
			{
				$set: {
					_id: userId,
					lastCollected: Long.fromNumber(this._lastCollected),
					tokens: new Int32(this._tokens),
					cash: Long.fromNumber(this._cash),
				},
			},
			{ upsert: true },
		);
	}
}
