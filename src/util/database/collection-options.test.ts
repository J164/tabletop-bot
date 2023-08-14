import { describe, expect, it } from 'vitest';
import * as CollectionOptions from './collection-options.js';

describe.each(Object.values(CollectionOptions))('collection creation options', (collection) => {
	it('should extend its respective collection options', () => {
		for (const [key, value] of Object.entries(collection.baseOptions)) {
			expect(collection.createOptions[key]).toEqual(value);
		}
	});
});
