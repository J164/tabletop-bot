import { describe, expect, it } from 'vitest';
import { fetchUser, User } from './user.js';

// TODO: environment variables for tests (tries to sign into MongoDB)
describe.todo('User', () => {
	it('should create a new User if one does not exist in the cache', () => {
		expect(fetchUser('foo')).toBeInstanceOf(User);
	});

	it('should fetch the cached User if fetched previously', () => {
		const user = fetchUser('foo');

		// eslint-disable-next-line @typescript-eslint/dot-notation
		user['bar'] = true;

		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(fetchUser('foo')['bar']).toBe(true);
	});
});
