import { MongoClient } from 'mongodb';

// TODO: set up validation in mongodb and make sure indexing is correct

const databaseClient = new MongoClient();
await databaseClient.connect();
export const database = databaseClient.db();
