import { globalLogger } from '../util/logger.js';

const logger = globalLogger.child({
	name: 'ready',
});

/** Callback to execute when the bot has connected */
export function onReady(): void {
	logger.info('Login success!');
}
