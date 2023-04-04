import { env } from 'node:process';
import { MongoClient } from 'mongodb';

// TODO: set up validation in mongodb and make sure indexing is correct

const databaseClient = new MongoClient(env.MONGO_URL ?? '');
await databaseClient.connect();
export const database = databaseClient.db(env.DATABASE_NAME);
