---
title: How to define a DB connecton in hooks.server.ts and store it in the locals object
description: How to define a DB connecton in hooks.server.ts and store it in the locals object
date_created: '2025-05-24T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
For additional info:
- https://khromov.se/the-comprehensive-guide-to-locals-in-sveltekit/
 
Connection details vary depending on the DB you're using, but generally, the pattern is the same: create the DB connection and store it in the locals object. 

> [!info]
> The locals object is available on the server-side only.

```ts
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

import { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } from '$env/static/private';
import pkg from 'pg';

const { Pool } = pkg;

// Create the pool once when the server starts
const pool = new Pool({
	host: PG_HOST,
	port: Number(PG_PORT) || 5432, // Ensure port is a number
	user: PG_USER,
	password: PG_PASSWORD,
	database: PG_DATABASE,
	ssl: false // Or configure based on your needs, e.g., { rejectUnauthorized: false } for self-signed certs
});

console.log(PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE);

// Optional: Listen for pool errors
pool.on('error', (err, client) => {
	console.error('Unexpected error on idle database client', err);
	// You might want to decide if the process should exit here
});

// Check DB health.
async function checkDbConnection() {
	const client = await pool.connect();
	try {
		await client.query('SELECT 1');
		console.log('Database connection successful');
	} catch (err) {
		console.error('Database connection failed:', err);
	} finally {
		client.release();
	}
}

// Call on startup
checkDbConnection();

process.on('SIGTERM', async () => {
	console.log('Closing database pool...');
	await pool.end();
	console.log('Database pool closed');
	process.exit(0);
});

// Optional: You can also handle other signals like SIGINT (Ctrl+C) if needed
export const handle: Handle = async ({ event, resolve }) => {
	// Make the pool available to all server-side endpoints
	event.locals.pool = pool;

	// Continue processing the request
	const response = await resolve(event);

	// Cleanup or other logic after the request is handled can go here if needed
	return response;
};
```

## Defining the types stored in the `locals` object

Anything added to the `locals` object should be a typed in the `./app.d.ts` file:

```ts
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
            pool: import('pg').Pool;
        }		
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
```