import { type CreateCollectionOptions } from 'mongodb';

/** Collection schema for banks */
export const BANK_SCHEMA = {
	clusteredIndex: {
		key: { _id: 1 },
		unique: true,
	},
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['_id', 'lastCollected', 'tokens', 'cash'],
			additionalProperties: false,
			properties: {
				_id: {
					bsonType: 'string',
					description: 'required Discord id of the user',
				},
				lastCollected: {
					bsonType: 'long',
					description: 'required 64-bit integer representing milliseconds from UNIX epoch',
				},
				tokens: {
					bsonType: 'int',
					minimum: 0,
					description: 'required non-negative 32-bit integer',
				},
				cash: {
					bsonType: 'long',
					minimum: 0,
					description: 'require non-negative 64-bit integer',
				},
			},
		},
	},
} satisfies CreateCollectionOptions;

/** Collection schema for Blackjack */
export const BLACKJACK_SCHEMA = {
	clusteredIndex: {
		key: { _id: 1 },
		unique: true,
	},
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['_id', 'stats'],
			additionalProperties: false,
			properties: {
				_id: {
					bsonType: 'string',
					description: 'required Discord id of the user',
				},
				stats: {
					bsonType: 'object',
					required: ['netMoneyEarned', 'wins', 'losses', 'pushes', 'blackjacks'],
					additionalProperties: false,
					properties: {
						netMoneyEarned: {
							bsonType: 'long',
							description: 'required double',
						},
						wins: {
							bsonType: 'int',
							minimum: 0,
							description: 'required non-negative 32-bit integer',
						},
						losses: {
							bsonType: 'int',
							minimum: 0,
							description: 'required non-negative 32-bit integer',
						},
						pushes: {
							bsonType: 'int',
							minimum: 0,
							description: 'required non-negative 32-bit integer',
						},
						blackjacks: {
							bsonType: 'int',
							minimum: 0,
							description: 'required non-negative 32-bit integer',
						},
					},
				},
			},
		},
	},
} satisfies CreateCollectionOptions;
