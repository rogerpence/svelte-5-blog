---
title: Sveltekit locals
description: Sveltekit locals
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
hooks.server.js

Save a value to the locals

```
export const handle = async ({ event, resolve }) => {

	event.locals.lang = 'en';
```

+layout.server.js

Make it available to route

```
export async function load({ locals }) {
	return {
		lang: locals.lang
	};
}
```

Get access to it in +layout.js

```
export const load = async (event) => {
	const lang = event.data.lang;
	console.log(`-->${lang}`);
};
```