import { type CollectionOptions, type CreateCollectionOptions } from 'mongodb';

/** Options for bank collection */
export const BANK_OPTIONS = {
	promoteLongs: false,
	promoteValues: false,
	promoteBuffers: false,
} satisfies CollectionOptions;

/** Create options for bank collection */
export const CREATE_BANK = {
	promoteLongs: false,
	promoteValues: false,
	promoteBuffers: false,
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
} satisfies CreateCollectionOptions & typeof BANK_OPTIONS;

/** Options for Blackjack collection */
export const BLACKJACK_OPTIONS = {
	promoteLongs: false,
	promoteValues: false,
	promoteBuffers: false,
} satisfies CollectionOptions;

/** Create options for Blackjack collection */
export const CREATE_BLACKJACK = {
	promoteLongs: false,
	promoteValues: false,
	promoteBuffers: false,
	clusteredIndex: {
		key: { _id: 1 },
		unique: true,
	},
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['_id', 'netMoneyEarned', 'wins', 'losses', 'pushes', 'blackjacks'],
			additionalProperties: false,
			properties: {
				_id: {
					bsonType: 'string',
					description: 'required Discord id of the user',
				},
				netMoneyEarned: {
					bsonType: 'double',
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
} satisfies CreateCollectionOptions & typeof BLACKJACK_OPTIONS;
