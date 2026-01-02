---
title: Svelte 5 standard setup
description: Svelte 5 standard setup
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
### Customize svelte.config.js

Add `alias` node under kit `node` to customize aliases:

```
alias: {
	$components: 'src/components',
	$data: 'src/lib/data',
	$routes: 'src/routes'
},
```

### Add `global.d.ts` under `\src` folder

Put global type definitions here.

### Establish Postgres connection in hooks.server.ts

This set requires installing Postgres `pg` package.
`hooks.server.ts`

```
import pkg from 'pg';

const { Pool } = pkg;
import type { PoolClient } from 'pg';

import {
    PG_HOST,
    PG_PORT,
    PG_USER,
    PG_DATABASE,
    PG_PASSWORD
} from '$env/static/private';

const pool = new Pool({
    host: PG_HOST,
    port: Number(PG_PORT),
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    ssl: false
});

export async function handle({ event, resolve }) {
    let client: PoolClient;

    try {
        client = await pool.connect();
        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database', err);
        process.exit(0);
    }

    // Extend event.locals with the custom type
    (event.locals as App.Locals).client = client;

    return resolve(event);
}
```

### Add a `/static` folder for static assets

Files like favicon.ico, robots.txt, and sitemap.xml go here.

### Add a `/src/routes/+layout.svelte` file

`svelte 4 version`

```ts
<script lang="ts">
	import { inject } from '@vercel/analytics';
	// import some helper that is exposed by your current framework to determine the right mode manually
	import { dev } from '$app/environment';

	inject({
		mode: dev ? 'development' : 'production',
	});
	import '../style.css';
</script>

<slot />
```

In the Svelte 4 example above the `inject` method is setting the `mode` to dev or production for Vercel.
[[Slots are deprecated]] in Svelte 5.

`svelte 5 version`

```ts
<script lang="ts">
    import '../app.css';

    let { children } = $props();
</script>

{@render children()}
```

In the Svelte 5 example above, the `../app.css` references the Tailwind-created `app.css` file
Implied in the CSS import above is the fact that whatever tooling you use to create your CSS (fingertips, PostCSS, TailWind, etc) should target a single CSS file in the `/src` directory.

### Folder structure

```
.
├── src/
│   ├── lib/
│   │   ├── components
│   │   └── data
│   └── routes
└── static
```