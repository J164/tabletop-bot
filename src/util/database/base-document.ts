export abstract class BaseDocument {
	private readonly _userId: string;
	private _saveTimer: NodeJS.Timeout | undefined;

	protected constructor(userId: string) {
		this._userId = userId;
	}

	/**
	 * Queues a update for the database entry for this document
	 */
	protected _queueUpdate(): void {
		this._saveTimer?.unref();

		this._saveTimer = setTimeout(async () => {
			try {
				console.log(this);
				await this._update(this._userId);
			} catch (error) {
				console.error(error);
			}
		}, 5000);
	}

	/**
	 * Updates the database entry for this document
	 * @param userId The user's Discord id
	 */
	protected abstract _update(userId: string): Promise<void>;
}
