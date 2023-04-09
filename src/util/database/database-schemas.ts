import { type CreateCollectionOptions } from 'mongodb';

// TODO: wait for atlas clusters to update to 6.0 for cluster indexes and make new schemas

/** The collection schema for user stats */
export const STATS_SCHEMA = {
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['userId', 'bank'],
			additionalProperties: false,
			properties: {
				_id: {},
				userId: {
					bsonType: 'string',
					description: 'required Discord id of the user',
				},
				bank: {
					bsonType: 'object',
					required: ['lastCollected', 'tokens', 'cash'],
					additionalProperties: false,
					properties: {
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
				blackjack: {
					bsonType: 'object',
					required: ['netMoneyEarned', 'wins', 'losses', 'pushes', 'blackjacks'],
					additionalProperties: false,
					properties: {
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
	},
} satisfies CreateCollectionOptions;
