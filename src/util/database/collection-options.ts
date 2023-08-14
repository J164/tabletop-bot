import { type MongoCollectionOptions } from '@j164/bot-framework';

export const BANK_COLLECTION = {
	baseOptions: {
		promoteLongs: false,
		promoteValues: false,
		promoteBuffers: false,
	},
	createOptions: {
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
	},
	indexOptions: [],
} satisfies MongoCollectionOptions;

export const BLACKJACK_COLLECTION = {
	baseOptions: {
		promoteLongs: false,
		promoteValues: false,
		promoteBuffers: false,
	},
	createOptions: {
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
	},
	indexOptions: [],
} satisfies MongoCollectionOptions;
