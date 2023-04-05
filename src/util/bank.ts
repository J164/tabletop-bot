import { type JSONEncodable } from 'discord.js';
import { Long } from 'mongodb';

/** JSON encoded Bank */
export type RawBank = {
	lastCollected: string;
	tokens: number;
	cash: Long;
};

const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
/** The number of tokens rewarded per day to a player's bank account */
export const DAILY_TOKENS = 50;

/** A user's bank */
export class Bank implements JSONEncodable<RawBank> {
	private _lastCollected: Date;
	private _tokens: number;
	private _cash: bigint;

	public constructor(bank: RawBank | Record<string, undefined>) {
		const { lastCollected, tokens, cash } = bank;

		this._lastCollected = new Date(lastCollected ?? Date.now());
		this._tokens = tokens ?? 100;
		this._cash = cash?.toBigInt() ?? 0n;
	}

	public get tokens(): number {
		return this._tokens;
	}

	public get cash(): bigint {
		return this._cash;
	}

	/**
	 * Adds an amount of cash to the bank
	 * @param amount The amount of cash to add
	 */
	public addMoney(amount: number): void {
		this._cash += BigInt(amount);
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
	 * @returns The number of idle days cashed in
	 */
	public checkIdleTokens(): number {
		const now = Date.now();
		const idleTime = now - this._lastCollected.getTime();
		const idleDays = Math.floor(idleTime / TWENTY_FOUR_HOURS_IN_MILLISECONDS);

		this._lastCollected = new Date(now - (idleTime % TWENTY_FOUR_HOURS_IN_MILLISECONDS));
		this._tokens += idleDays * DAILY_TOKENS;

		return idleDays;
	}

	public toJSON(): RawBank {
		return { lastCollected: this._lastCollected.toISOString(), tokens: this._tokens, cash: Long.fromBigInt(this._cash) };
	}
}
