export class Bank {
	private _tokens: number;

	public constructor() {
		this._tokens = 100;
	}

	public get tokens(): number {
		return this._tokens;
	}

	public addTokens(amount: number): void {
		this._tokens += amount;
	}

	public chargeTokens(amount: number): boolean {
		if (this._tokens > amount) {
			this._tokens -= amount;
			return true;
		}

		return false;
	}
}
