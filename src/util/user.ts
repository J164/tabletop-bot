import { type Logger } from 'pino';
import { type CollectionFetcher } from '@j164/bot-framework';
import { BlackjackSave } from '../games/blackjack/save.js';
import { Bank } from './bank.js';

/** A user */
export class User {
	private _bank: Bank | undefined;
	private _blackjackSave: BlackjackSave | undefined;

	public constructor(
		private readonly _userId: string,
		private readonly _logger: Logger,
		private readonly _fetchCollection: CollectionFetcher,
	) {}

	/**
	 * Gets the user's bank
	 * @returns The user's bank
	 */
	public async getBank(): Promise<Bank> {
		return (this._bank ??= await Bank.get(this._userId, this._logger, this._fetchCollection));
	}

	/**
	 * Gets the user's blackjack save
	 * @returns The user's blackjack save
	 */
	public async getBlackjackSave(): Promise<BlackjackSave> {
		return (this._blackjackSave ??= await BlackjackSave.get(this._userId, this._logger, this._fetchCollection));
	}
}

const stats: Record<string, User | undefined> = {};

/**
 * Fetches a user. Creates a new user object if none exists.
 * @param userId The Discord id of the user
 * @returns The user object
 */
export function fetchUser(userId: string, logger: Logger, fetchCollection: CollectionFetcher): User {
	return (stats[userId] ??= new User(userId, logger, fetchCollection));
}
