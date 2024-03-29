import { type ApplicationCommandDataResolvable } from 'discord.js';

/** The bot's application commands */
export const APPLICATION_COMMANDS = [
	{
		name: 'help',
		description: 'Displays the help menu',
	},
	{
		name: 'stats',
		description: 'Displays your stats',
	},
	{
		name: 'daily-reward',
		description: 'Redeem your daily token reward',
	},
	{
		name: 'blackjack',
		description: 'A classic casino game played against the house',
		options: [
			{
				type: 1,
				name: 'play',
				description: 'Play Blackjack',
			},
			{
				type: 1,
				name: 'rules',
				description: 'Learn to play Blackjack',
			},
			{
				type: 1,
				name: 'stats',
				description: 'See your Blackjack stats',
			},
		],
	},
] satisfies ApplicationCommandDataResolvable[];
