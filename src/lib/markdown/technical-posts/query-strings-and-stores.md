---
title: Sveltekit query strings and stores
description: Sveltekit query strings and stores
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
I wanted to switch between HTML and translation views for eblast creation. I thought I'd be smart and use a query string value to toggle the two modes. That worked, but caused trouble with SSR. I am going to take the eblast back to using a static value to indicate the mode.

Here is how to read a query string and persist its value across components

### `lib/store.js`

This creates a writeable store.

```
import { writable } from 'svelte/store';

export const devmode = writable('');
```

### `.../+page.js`

This fetches a query string value and returns it. This passes the query string value to the parent page through the `page` store. Note how the query string value had to be read in the `+page.js` file--query strings can't be read directly in `+page.svelte` files (at least as of 4 October I think that!).

```
export const prerender = true;
export const csr = false;

import { browser, dev, building, version } from '$app/environment';

export async function load({ params, url }) {
	if (browser) {
		let mode = url.searchParams.get('mode');
		if (!mode) mode = 'html';
		return { mode };
	}
}
```

### `.../+page.svelte`

This interrogates the value passed in through the `page` store.

```
import { page } from '$app/stores';
devmode.update(() => $page.data.mode);
```

### In any component

This code works, but I'm not sure that it's idiomatic. It reads the value of the `devmode` store. It seems nuts that it takes this arcane code to read a store. Maybe I'm missing something. I'll revisit this later.

```
let mode;

import { devmode } from '$lib/store.js';
devmode.subscribe((value) => {mode = value});
```