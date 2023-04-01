import { type JSONEncodable } from 'discord.js';

/** JSON encoded Bank */
export type RawBank = {
	tokens: number;
};

/** A user's bank */
export class Bank implements JSONEncodable<RawBank> {
	private _tokens: number;

	public constructor(bank?: RawBank) {
		this._tokens = bank ? bank.tokens : 100;
	}

	public get tokens(): number {
		return this._tokens;
	}

	/**
	 * Adds a number of tokens to the bank
	 * @param amount The number of tokens to add
	 */
	public addTokens(amount: number): void {
		this._tokens += amount;
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

	public toJSON(): RawBank {
		return { tokens: this._tokens };
	}
}
