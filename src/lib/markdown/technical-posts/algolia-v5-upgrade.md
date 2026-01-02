---
title: Algolia v5 upgrade
description: Algolia v5 upgrade
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - asna-com
---
https://www.algolia.com/doc/libraries/javascript/v5/upgrade/

Sent on May 12th.
https://support.algolia.com/hc/en-us/requests/695588

```
I removed the algoliasearch 4.x package and added this Algolia package:

"algoliasearch": "5",



v4 code that works:

import { algoliasearch } from 'algoliasearch';


let searchClient = algoliasearch(algolia_app_id, algolia_search_api_key);
let index = searchClient.initIndex(algolia_index_name);

const result = await index.search(query,
                                  {
  				    attributesToRetrieve: ['title', 'slug', 'locale', 'description'],
 				    facetFilters: filter,
				    hitsPerPage: HITS_PER_PAGE
				  })


v5 conversion attempt: This code fails with unknown parameter error in searchSingleIdex:


let searchClient = algoliasearch(algolia_app_id, algolia_search_api_key);


const result = await searchClient.searchSingleIndex(
		{ indexName: algolia_index_name, searchParams: query },
		{
			attributesToRetrieve: ['title', 'slug', 'locale', 'description'],
			facetFilters: filter,
			hitsPerPage: HITS_PER_PAGE
		}
);




While I'm at it, I also need to convert this to v5. Giving my struggles with the code above, I
haven't even tried to convert this... please help!


import algoliasearch from 'algoliasearch';
import * as dotenv from 'dotenv';

export async function refresh_algolia_online_index() {
	dotenv.config({ path: '../../../.env' });
	const markdownSearchData = await import('../data/search-index.json', {
		assert: { type: 'json' }
	});
	const pageSearchData = await import('../data/search-index-pages.json', {
		assert: { type: 'json' }
	});

	const searchData = [...markdownSearchData.default, ...pageSearchData.default];

	const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
	const index = client.initIndex('Ocho');

	try {
		const result = await index.clearObjects();
	} catch (error) {
		console.log(error);
		process.exit(4);
	}
	console.log(`${process.env.ALGOLIA_INDEX_NAME} index cleared`);

	try {
		const result = await index.saveObjects(searchData, {
			autoGenerateObjectIDIfNotExist: true
		});
	} catch (error) {
		console.log(error);
		process.exit(4);
	}
	console.log(`${process.env.ALGOLIA_INDEX_NAME} refreshed`);
}
```