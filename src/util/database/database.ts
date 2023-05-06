import { env } from 'node:process';
import { type Collection, MongoClient } from 'mongodb';
import { type EncodedBlackjack } from '../../games/blackjack/save.js';
import { type EncodedBank } from '../bank.js';
import { globalLogger } from '../logger.js';
import { BANK_OPTIONS, BLACKJACK_OPTIONS, CREATE_BANK, CREATE_BLACKJACK } from './collection-options.js';

export const databaseLogger = globalLogger.child({
	name: 'database',
});

const databaseClient = new MongoClient(env.MONGO_URL ?? '');
await databaseClient.connect();

const database = databaseClient.db(env.DATABASE_NAME);

export const [bankCollection, blackjackCollection] = await fetchCollections();

async function fetchCollections(): Promise<[Collection<EncodedBank>, Collection<EncodedBlackjack>]> {
	const collectionList = await database.collections();
	const collections = new Set<string>();

	for (const collection of collectionList) {
		collections.add(collection.collectionName);
	}

	return Promise.all([
		collections.has('bank') ? database.collection('bank', BANK_OPTIONS) : await database.createCollection<EncodedBank>('bank', CREATE_BANK),
		collections.has('blackjack')
			? database.collection('blackjack', BLACKJACK_OPTIONS)
			: await database.createCollection<EncodedBlackjack>('blackjack', CREATE_BLACKJACK),
	]);
}
