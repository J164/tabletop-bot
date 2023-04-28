import { env } from 'node:process';
import { type Collection, MongoClient } from 'mongodb';
import { type EncodedBlackjack } from '../../games/blackjack/save.js';
import { type EncodedBank } from '../bank.js';
import { BANK_SCHEMA, BLACKJACK_SCHEMA } from './database-schemas.js';

const databaseClient = new MongoClient(env.MONGO_URL ?? '');
await databaseClient.connect();

const database = databaseClient.db(env.DATABASE_NAME);

export const { bankCollection, blackjackCollection } = await fetchCollections();

async function fetchCollections(): Promise<{ bankCollection: Collection<EncodedBank>; blackjackCollection: Collection<EncodedBlackjack> }> {
	const collectionList = await database.collections();
	const collections: Record<string, Collection<any> | undefined> = {};

	for (const collection of collectionList) {
		collections[collection.collectionName] = collection;
	}

	return {
		bankCollection: collections.bank ?? (await database.createCollection<EncodedBank>('bank', BANK_SCHEMA)),
		blackjackCollection: collections.blackjack ?? (await database.createCollection<EncodedBlackjack>('blackjack', BLACKJACK_SCHEMA)),
	};
}
