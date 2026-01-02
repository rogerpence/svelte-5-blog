---
title: Using +page.server.ts for a server back end action for a page
description: Using +page.server.ts for a server back end action for a page
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - sveltekit
  - nuggets
---
> [!info]
> This is in the `post-example-2` route in the `sveltekit/apis` project.

This is a small example demonstrating data loading in a `+page.server.ts` file and displaying it in the corresponding `+page.svelte` component using SvelteKit 5 syntax and TypeScript.

##### 1. Create the Route Directory and Files:

Create a new route directory, for example, `src/routes/server-data/`. Inside this directory, create two files:

-   `src/routes/server-data/+page.server.ts`
-   `src/routes/server-data/+page.svelte`

##### +page.server.ts code

**2. Write the Server Load Function (`+page.server.ts`):**

This file exports a `load` function that runs exclusively on the server. It fetches or generates data and returns it.

```typescript
// src/routes/server-data/+page.server.ts

import type { PageServerLoad } from "./$types"; // Import the specific type for this page's server load function

// Define an interface for the data shape we plan to return (optional but good practice)
interface ServerData {
    message: string;
    timestamp: string;
    randomNumber: number;
}

// This 'load' function runs ONLY on the server side
export const load: PageServerLoad = async ({ locals, params }) => {
    console.log("Executing +page.server.ts load function...");
    // console.log('Accessing locals (e.g., user):', locals.user); // Example if you have hooks setting locals
    // console.log('Accessing route params:', params); // Example if the route had params like /server-data/[id]

    // Simulate fetching data or doing server-specific work
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate async delay

    const data: ServerData = {
        message: "Hello from the server!",
        timestamp: new Date().toISOString(), // Generate data on the server
        randomNumber: Math.floor(Math.random() * 100),
    };

    // The object returned here is serialized and sent to the client
    // It will be available in the corresponding +page.svelte via the `data` prop
    return data;
};

// Note: You don't return a Response object here like in +server.ts.
// You return plain data that SvelteKit wraps for you.
```

##### +page.svelte code

**3. Write the Page Component (`+page.svelte`):**

This Svelte component receives the data returned by the `load` function via a special `data` prop.

```svelte
<!-- src/routes/server-data/+page.svelte -->

<script lang="ts">
	// Import the PageData type, which represents the combined data
	// from all load functions (+page.server.ts and potentially +layout.server.ts, etc.)
	import type { PageData } from './$types';

	// This 'data' prop is automatically populated by SvelteKit
	// with the return value from the load function(s).
	export let data: PageData;

	// The 'data' object here will have the shape defined by the return value
	// of the load function in +page.server.ts ({ message, timestamp, randomNumber })
</script>

<svelte:head>
	<title>Server Data Example</title>
</svelte:head>

<div class="container">
	<h1>Data from Server Load</h1>

	<p>
		<strong>Message:</strong>
		{data.message}
	</p>

	<p>
		<strong>Generated At (Server Time):</strong>
		{data.timestamp}
	</p>

	<p>
		<strong>Server Random Number:</strong>
		{data.randomNumber}
	</p>

	<p><em>Refresh the page to see the timestamp and random number update (generated server-side).</em></p>

    <p>
        <a href="/">Go Home</a>
    </p>
</div>

<style>
	.container {
		font-family: sans-serif;
		padding: 2em;
		border: 1px solid #ccc;
		border-radius: 8px;
		max-width: 600px;
		margin: 2em auto;
		background-color: #f9f9f9;
	}
    h1 {
        color: #333;
        border-bottom: 2px solid #eee;
        padding-bottom: 0.5em;
    }
    p {
        line-height: 1.6;
    }
    strong {
        color: #555;
    }
    em {
        color: #777;
        font-size: 0.9em;
    }
     a {
        color: #007bff;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
```

**Explanation:**

1.  **`+page.server.ts`:**

    -   Imports `PageServerLoad` from `./$types`. SvelteKit automatically generates these types based on your file structure and exported functions, providing excellent type safety.
    -   Defines and exports an `async` function named `load`.
    -   Inside `load`, it simulates fetching data (or performs actual server-side logic like database queries).
    -   It returns a plain JavaScript object (`{ message, timestamp, randomNumber }`). This object **must** be serializable (convertible to JSON).
    -   This code runs _only_ on the server during the initial page load or server-side rendering (SSR) and during subsequent navigation if data needs refreshing (depending on invalidation). It _never_ runs in the user's browser.

2.  **`+page.svelte`:**
    -   Uses `<script lang="ts">` for TypeScript support.
    -   Imports `PageData` from `./$types`. This type represents the shape of the `data` prop.
    -   Declares `export let data: PageData;`. SvelteKit automatically injects the data returned by the `load` function(s) into this prop.
    -   The template (`<template>` or just HTML) accesses properties of the `data` object (e.g., `{data.message}`).

**How it Works:**

1.  When you navigate to `/server-data` in your browser.
2.  SvelteKit's server detects the request.
3.  It finds the `src/routes/server-data/+page.server.ts` file and executes its `load` function.
4.  The `load` function generates the data object and returns it.
5.  SvelteKit takes this data, serializes it, and includes it in the initial HTML sent to the browser (for SSR) or sends it as JSON during client-side navigation.
6.  The `src/routes/server-data/+page.svelte` component is rendered. SvelteKit automatically passes the fetched data into the `data` prop.
7.  The component displays the data received from the server.