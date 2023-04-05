import { env } from 'node:process';
import { MongoClient } from 'mongodb';
import { type RawStats } from '../stats.js';
import { STATS_SCHEMA } from './database-schemas.js';

const databaseClient = new MongoClient(env.MONGO_URL ?? '');
await databaseClient.connect();

const database = databaseClient.db(env.DATABASE_NAME);

export const statsCollection = await database.createCollection<RawStats>('stats', STATS_SCHEMA);
