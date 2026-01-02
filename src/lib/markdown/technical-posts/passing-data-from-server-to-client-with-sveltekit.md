---
title: Passing server-side data to the client in Sveltekit
description: Passing server-side data to the client in Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - asna-svelte
---
This file forwards a page's locale and its URL (without the querystring) as a `pageInfo` object.

`+layout.server.js`

```
export const load = async (request) => {
	let locale = request.url.pathname.slice(1, 3);
	// This is the URL only--it doesn't include the query string.
	let url = request.url.pathname;

	return {
		pageInfo: {
			locale: locale,
			url: url
		}
	};
};
```

## With no +layout.js file

If the route does not have a `+layout.js` file this data is forwarded to `+page.svelte` like this:

`+page.svelte`

```
<script>

export let data

</script>
```

where `data` value is:

```
data: { pageInfo: { locale: 'en', url: '/en/test' } }
```

## With +layout.js file

`+layout.js` can forward its own data (`otherData`) in this case and the data from the `+layout.server.js` file by spreading its `data` object.

`+layout.js`

```
export async function load(data) {
	return {
		...data,
		otherData: {
			name: 'George',
			group: 'Beatles'
		}
	};
}
```

``+page.svelte`

```
export data

const pageInfo = data.data.pageInfo
const otherData = data.otherData

```

Fetching the data from both +`layout.server.js` and `+layout.js` files requires an looking `data.data` construct. Considering the page order, it sorta makes sense. The first `data` object comes from the immediately preceding `+layout.js` file and then the `data.data` from `+layout.server.js` which precedes `+layout.js`,

Visual it like this:

```
+layout.server.js               sends 'data' with a 'pageInfo' property
  +layout.js                    sends 'data' with an 'otherData' property
    +page.svelte                receives 'data.otherData' and 'data.data.pageInfo'
```

## For what it's worth

I tried several variations like the one below to collapse the data in the `+layout.js` file and none of them worked.

`+layout.js`

```
export async function load(data) {
	return {
		pageInfo: {
		  locale: data.pageInfo.locale,
		  url: data.pageInfo.url
		}
		otherData: {
			name: 'George',
			group: 'Beatles'
		}
	};
}
```

It's mysterious to me why the above code didn't work. Dev tools shows that the `data` object comes into the `load` function with the `pageInfo` property.

![[svelte-something.png]]