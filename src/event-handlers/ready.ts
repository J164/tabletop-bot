import { pino } from 'pino';

const logger = pino({
	name: 'ready',
});

/** Callback to execute when the bot has connected */
export function onReady(): void {
	logger.info('Login success!');
}
