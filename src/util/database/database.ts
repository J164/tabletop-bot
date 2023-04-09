import { env } from 'node:process';
import { MongoClient } from 'mongodb';
import { type EncodedBlackjack } from '../../games/blackjack/save.js';
import { type EncodedBank } from '../bank.js';

// TODO: add collection configs

const databaseClient = new MongoClient(env.MONGO_URL ?? '');
await databaseClient.connect();

const database = databaseClient.db(env.DATABASE_NAME);

/** Database collection for Bank documents */
export const bankCollection = await database.createCollection<EncodedBank>('bank');
/** Database colletion for Blackjack documents */
export const blackjackCollection = await database.createCollection<EncodedBlackjack>('blackjack');
