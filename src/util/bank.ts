/** A user's bank */
export class Bank {
	private _tokens: number;

	public constructor() {
		this._tokens = 100;
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
}
