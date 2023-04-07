import { env } from 'node:process';
import { MongoClient } from 'mongodb';
import { type BSONValue } from 'bson';
import { type EncodedStats } from '../stats.js';
import { STATS_SCHEMA } from './database-schemas.js';

type MongoDBObject = { [key: string]: BSONValue | string | undefined | MongoDBObject };

export type MongodbEncodable<T extends MongoDBObject> = {
	toEncoded(): T;
};

const databaseClient = new MongoClient(env.MONGO_URL ?? '');
await databaseClient.connect();

const database = databaseClient.db(env.DATABASE_NAME);

export const statsCollection = await database.createCollection<EncodedStats>('stats', STATS_SCHEMA);
