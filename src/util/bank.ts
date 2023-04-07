import { Int32, Long } from 'mongodb';
import { type MongodbEncodable } from './database/database.js';

/** JSON encoded Bank */
export type EncodedBank = {
	lastCollected: Long;
	tokens: Int32;
	cash: Long;
};

const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
/** The number of tokens rewarded per day to a player's bank account */
export const DAILY_TOKENS = 50;

/** A user's bank */
export class Bank implements MongodbEncodable<EncodedBank> {
	private _lastCollected: number;
	private _tokens: number;
	private _cash: number;

	public constructor({ lastCollected, tokens, cash }: EncodedBank | Record<string, undefined>) {
		this._lastCollected = lastCollected?.toNumber() ?? Date.now();
		this._tokens = tokens?.toJSON() ?? 100;
		this._cash = cash?.toNumber() ?? 0;
	}

	public get tokens(): number {
		return this._tokens;
	}

	public get cash(): number {
		return this._cash;
	}

	/**
	 * Adds an amount of cash to the bank
	 * @param amount The amount of cash to add
	 */
	public addMoney(amount: number): void {
		this._cash += amount;
	}

	/**
	 * Removes a number of tokens from the bank if the bank has enough tokens
	 * @param amount The amount of tokens to remove
	 * @returns Whether the operation succeeded
	 */
	public chargeTokens(amount: number): boolean {
		if (this._tokens > amount) {
			this._tokens -= amount;
			return true;
		}

		return false;
	}

	/**
	 * Collects daily token rewards
	 * @returns The number of tokens cashed in
	 */
	public checkIdleTokens(): number {
		const now = Date.now();
		const idleTime = now - this._lastCollected;

		this._lastCollected = now - (idleTime % TWENTY_FOUR_HOURS_IN_MILLISECONDS);

		const idleTokens = Math.floor(idleTime / TWENTY_FOUR_HOURS_IN_MILLISECONDS) * DAILY_TOKENS;
		this._tokens += idleTokens;

		return idleTokens;
	}

	public toEncoded(): EncodedBank {
		return { lastCollected: Long.fromNumber(this._lastCollected), tokens: new Int32(this._tokens), cash: Long.fromNumber(this._cash) };
	}
}
