import indexObjects from '$lib/data/brainiac-index-objects.json';
//import type { Result } from './search.ts';

import { createIndex, searchIndex } from './flex-index-helpers';

// Listen for messages
addEventListener('message', async (e) => {
	try {
		const { type, payload } = e.data;

		if (type === 'load') {
			// Create search index.
			createIndex(indexObjects);

			// Tell requester FlexSearch is ready.
			postMessage({ type: 'ready' });
		}

		if (type === 'search_en') {
			const searchTerm = payload.searchTerm;
			// // // Search posts index.
			const results = searchIndex('en', searchTerm);
			// // // Send message with results and search term.
			postMessage({ type: 'results', payload: { results, searchTerm } });
		}

		if (type === 'search_es') {
			// // Set search term.
			// const searchTerm = payload.searchTerm;
			// // Search posts index.
			// const results = searchIndex('es', searchTerm);
			// // const pageResults = results?.filter((result: Result) => result.isPage);
			// // const postResults = results?.filter((result: Result) => !result.isPage);
			// // const allResults = [...pageResults, ...postResults];
			// // Send message with results and search term.
			// postMessage({ type: 'results', payload: { results, searchTerm } });
		}
	} catch (err) {
		postMessage({
			type: 'worker_error',
			payload: {
				message: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined
			}
		});
	}
});
