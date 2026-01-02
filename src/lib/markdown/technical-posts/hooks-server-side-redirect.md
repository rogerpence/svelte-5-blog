---
title: Sveltekit server-side redirect
description: Sveltekit server-side redirect
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
> This [JoyOfCode video](https://www.youtube.com/watch?v=Kzrz7GZ9pIg) shows how to change the incoming HTML with a hook, as well as how to fetch the URL of a the request. Both of these things are probably necessary for authentication.
> This [Huntabyte video](https://www.youtube.com/watch?v=K1Tya6ovVOI&t=617s) shows how to project routes with hooks.

A multi-language site needs to unconditionally redirect the request for the root to a specific page. In this case, it needs to redirect to the `/en` route.

The incoming path request is available in the [[Event object]] object (as shown below).

```
import { redirect } from '@sveltejs/kit';

// State 1 - request received.
export const handle = async ({ event, resolve }) => {
	// Stage 2 - do something with incoming request.

	console.log(event);

	// Root requested?
	if (event.url.pathname == '/') {
		throw redirect(302, '/en');
	}

	// Stage 3 - Send response
	const response = await resolve(event);

	return response;
};
```