// TODO: wait for atlas clusters to update to 6.0 for cluster indexes

import { CreateCollectionOptions } from 'mongodb';

export const USER_SCHEMA = {
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
					required: ['tokens'],
					additionalProperties: false,
					properties: {
						tokens: {
							bsonType: 'int',
							minimum: 0,
							description: 'required non-negative 32-bit integer',
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
