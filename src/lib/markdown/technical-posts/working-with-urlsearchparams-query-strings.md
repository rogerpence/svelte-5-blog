---
title: Working with search parameters in Sveltekit
description: Working with search parameters in Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Sveltekit's [[Working with HTTP context|context object]] uses the URLSearchParams object for query strings. The `getQueryStringObject` helper makes it easier to work with the URLSearchParams object.

Put getQueryStringObject() in a `utils.ts` file in the `lib` folder.

```
export function getQueryStringObject(obj) {
	// Collapse the SearchParm query string object
	// into something more helpful.
	const qs = {};
	for (const q of obj) {
		qs[q[0]] = q[1];
	}

	// This method counts as a key, so
	// subtract 1 from length.
	qs.getKeyCount = function () {
		return Object.keys(this).length - 1;
	};

	qs.hasKeys = function () {
		return Object.keys(this).length - 1 == 0;
	};

	return qs;
}
```

The resulting object has properties for each query string key and a `hasKeys()` to show if query string keys are available.

In a route method pass the `context.url.searchPararms` object to `getQueryStringObject()` to get the helper object.

This is in an API

```
import { getQueryStringObject } from '$lib/utils.js';

export async function GET(context) {
	const qs = getQueryStringObject(context.url.searchParams);

	let posts;

	// Get filtered posts
	if (qs.hasOwnProperty('filter')) {
		posts = await getFilteredPosts(qs.filter);
		return json(posts);
	}

	posts = await getAllPosts();
	return json(posts);
```