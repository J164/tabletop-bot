import { Int32 } from 'mongodb';
import { type MongodbEncodable } from '../../util/database/database.js';

/** A user's blackjack stats */
export type EncodedBlackjackStats = {
	netMoneyEarned: Int32;
	wins: Int32;
	losses: Int32;
	pushes: Int32;
	blackjacks: Int32;
};

export class BlackjackStats implements MongodbEncodable<EncodedBlackjackStats> {
	public netMoneyEarned: number;
	public wins: number;
	public losses: number;
	public pushes: number;
	public blackjacks: number;

	public constructor({ netMoneyEarned, wins, losses, pushes, blackjacks }: Partial<EncodedBlackjackStats>) {
		this.netMoneyEarned = netMoneyEarned?.toJSON() ?? 0;
		this.wins = wins?.toJSON() ?? 0;
		this.losses = losses?.toJSON() ?? 0;
		this.pushes = pushes?.toJSON() ?? 0;
		this.blackjacks = blackjacks?.toJSON() ?? 0;
	}

	public toEncoded(): EncodedBlackjackStats {
		return {
			netMoneyEarned: new Int32(this.netMoneyEarned),
			wins: new Int32(this.wins),
			losses: new Int32(this.losses),
			pushes: new Int32(this.pushes),
			blackjacks: new Int32(this.blackjacks),
		};
	}
}
