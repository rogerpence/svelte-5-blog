---
title: Sveltekit universal load functions
description: Sveltekit universal load functions
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
https://kit.svelte.dev/docs/load#universal-vs-server-input

Both universal and server load functions have access to properties describing the request (params, route and url) and various functions (fetch, setHeaders, parent and depends).

```js
export async function load({ url, route, params }) {
...
}
```

yields:

```js
route = { id: "/en/kb/[slug]" };
url = "http://localhost:5173/en/kb/first";
params = { slug: "first" };
```

+layout.js

```
export const load = async (data) => {
	// console.log($page);
	return {
		...data,
		pageUrl: 'bobobob'
	};
};
```

+page.svelte

```
export async function load({ parent }) {
	const parentData = await parent();
...
}
```