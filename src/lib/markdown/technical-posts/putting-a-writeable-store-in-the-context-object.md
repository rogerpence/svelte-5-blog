---
title: Writeable store in Sveltekit
description: Writeable store in Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
I'm not sure what I'm doing here... I think there are other ways to pass data from a layout to a child page. At the very least, this shows how to use a strongly-typed

[Svelte docs](https://kit.svelte.dev/docs/state-management#using-stores-with-context)

Example here:

`C:\Users\thumb\Documents\Projects\svelte\focused\stores`

#### layout `+layout.svelte`

```
<script lang="ts">
	import { setContext, getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	/** @type {import('./$types').LayoutData} */

	// Create a store and update it when necessary...
	const user: Writable<string> = writable('');

	$: user.set('roger pence');
	// ...and add it to the context for child components to access
	setContext('user', user);
</script>

<slot />
```

#### direct child `+page.svelte`

```
<script>
	import { getContext } from 'svelte';
	// Retrieve user store from context
	const user = getContext('user');
</script>

<h1>Welcome to SvelteKit</h1>

<p><a href="/about">About</a></p>
<p><a href="/contact">Contact</a></p>

<p>Welcome {$user}</p>
```