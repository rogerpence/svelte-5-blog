---
title: Using the Postgres pg module with sveltekit - part 1
description: Using the Postgres pg module with sveltekit - part 1
date_created: 2025-05-20T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - postgres
---
Setting up the connection to be globally available through the locals collection in  `hooks.server.ts`.

Some of the following code is optional: 
- checkDBConnection
- process.on for SIGTERM

 
```ts
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

import {
    PG_HOST,
    PG_PORT,
    PG_USER,
    PG_PASSWORD,
    PG_DATABASE
} from '$env/static/private';
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
}
```