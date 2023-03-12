import { pino } from 'pino';

const logger = pino({
	name: 'ready',
});

export function onReady(): void {
	logger.info('Login success!');
}
