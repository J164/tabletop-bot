import { fetchStats } from '../../util/stats.js';

export function fetchBlackjackStats(userId: string): BlackjackStats {
	const stats = fetchStats(userId);

	return stats.blackjack ?? (stats.blackjack = new BlackjackStats());
}

export class BlackjackStats {
	private _earnings: number;
	private _tokens: number;

	public constructor() {
		this._earnings = 0;
		this._tokens = 100;
	}

	public get tokens(): number {
		return this._tokens;
	}

	public updateEarnings(amount: number): void {
		this._earnings += amount;
	}

	public chargeTokens(amount: number): boolean {
		if (this._tokens > amount) {
			this._tokens -= amount;
			return true;
		}

		return false;
	}
}
