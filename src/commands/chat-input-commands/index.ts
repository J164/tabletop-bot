import { type CommandType, type ChatInputCommand } from '../../types/client.js';
import { help } from './help.js';

export const chatInputCommands = new Map<string, ChatInputCommand<CommandType>>([
	[
		'help',
		{
			respond: help,
			type: 'Global',
		},
	],
]);
