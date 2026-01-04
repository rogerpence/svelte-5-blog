---
title: Managing Postgres connection pooling
description: Managing Postgres connection pooling
date_created: 2025-06-13T00:00:00.000Z
date_updated: 2025-11-03T00:00:00.000Z
date_published: 2026-01-03
pinned: false
tags:
  - postgres
---
This discusses this Postgres error

```MaxListenersExceededWarning: Possible EventEmitter memory leak detected.```

encountered during dev work with Sveltekit.

This is a very common warning in Node.js applications, especially during development with tools like SvelteKit that have hot-reloading. Let's break it down.

### The Short Answer (TL;DR)

This warning means your application is repeatedly setting up "shutdown" listeners for your database connection (or something similar) without ever cleaning up the old ones. This typically happens in a SvelteKit development environment because the server restarts on every file change (Hot Module Replacement), but the old database connection isn't being properly closed.

**You are likely creating a new database connection pool on every server reload, and each one is adding a listener to know when the app shuts down. You're leaking these listeners.**

The fix is **not** to increase the listener limit. The fix is to ensure you only have **one** instance of your database client/pool for the entire application lifetime and to properly close it when the application terminates.


### Detailed Breakdown of the Error Message

Let's dissect the message itself: `(node:5232) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 SIGTERM listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit`

1.  **`EventEmitter`**: This is a core building block in Node.js. Many objects, like network connections, file streams, and the `process` object itself, "emit" events. You can listen for these events using methods like `.on()` or `.addListener()`.

2.  **`process`**: This is a global Node.js object that represents the current running application. It's an `EventEmitter`.

3.  **`SIGTERM`**: This is a "signal" that can be sent to a process to request its termination (a graceful shutdown). When your SvelteKit dev server restarts, or when a production environment manager (like Docker or PM2) stops your app, it often sends a `SIGTERM` signal. Your code can *listen* for this signal to perform cleanup tasks, like closing database connections.

4.  **`MaxListenersExceededWarning`**: By default, Node.js will warn you if you add more than 10 listeners for the *same event* on the *same EventEmitter*. This is a safety feature because it's a strong indicator of a "memory leak." You're allocating resources (the listeners) but never releasing them.

### Why This Happens in a SvelteKit + Postgres App

The most common cause is how you're initializing your Postgres client (like `node-postgres` i.e., `pg`, or an ORM like `Drizzle ORM` or `Prisma`).

Let's look at a **common incorrect pattern**:

```javascript
// src/routes/some-route/+server.js or a hook
import pg from 'pg';

// ❌ ANTI-PATTERN: This code runs every time the server reloads in dev mode.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Many database clients automatically add a SIGTERM listener
// to gracefully close the pool on shutdown.
// So, on every file save:
// 1. Vite reloads the server module.
// 2. A NEW pool is created.
// 3. A NEW SIGTERM listener is added to the `process` object.
// 4. The OLD pool and its listener are never cleaned up.
// After 10 reloads, you get the warning.

export async function GET() {
  const result = await pool.query('SELECT NOW()');
  // ...
}
```

### The Correct Solution: The Singleton Pattern

You need to ensure that only **one instance** of your database connection pool is ever created. A common way to do this is to create it in a dedicated module and cache it.

**Step 1: Create a dedicated database client module.**

SvelteKit's server-only modules are perfect for this. Create a file like `src/lib/server/db.js`.

```javascript
// src/lib/server/db.js

import pg from 'pg';
import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from '$env/static/private';

// This is the key: declare the pool variable outside the function.
let pool: pg.Pool | null = null;

/**
 * Returns the singleton instance of the Postgres connection pool.
 */
export function getDbPool() {
  if (!pool) {
    console.log('Creating new PostgreSQL connection pool...');
    pool = new pg.Pool({
		host: PG_HOST,
		port: Number(PG_PORT) || 5432, // Ensure port is a number
		user: PG_USER,
		password: PG_PASSWORD,
		database: PG_DATABASE,
		ssl: false
	});

    // This is the graceful shutdown logic.
    // It's added ONCE when the pool is created.
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received. Closing DB pool.');
      pool.end();
    });

    // Optional: Also listen for SIGINT (Ctrl+C in terminal)
    process.on('SIGINT', () => {
      console.log('SIGINT signal received. Closing DB pool.');
      pool.end();
    });
  }
  return pool;
}
```

**Step 2: Use the singleton in your routes and hooks.**

Now, instead of creating a new pool everywhere, you import and use your getter function.

```javascript
// src/routes/some-route/+server.js

import { getDbPool } from '$lib/server/db.js';

const pool = getDbPool(); // Gets the existing pool, or creates it if it's the first time.

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    return new Response(JSON.stringify(result.rows[0]));
  } finally {
    // Always release the client back to the pool
    client.release();
  }
}
```

### Why This Works

*   The `pool` variable is created only once because Node.js caches modules. The first time `getDbPool()` is called, it creates the pool. Subsequent calls will see that `pool` already exists and will just return the cached instance.
*   Because the pool is only created once, the `process.on('SIGTERM', ...)` listener is also only attached **once**.
*   This completely solves the listener leak, and you get the added benefit of efficient connection pooling across your entire application.

### What About `emitter.setMaxListeners()`?

The error message suggests this as a "solution." **Almost always, this is a bad idea.** It's like turning off a smoke alarm because you don't like the noise. It hides the symptom (the warning) but doesn't fix the underlying problem (the memory leak). Only use it if you are absolutely certain you have a valid reason to have more than 10 listeners for a single event. In this SvelteKit/DB scenario, you do not.

## Fetching the pool object from locals

The code above says to call `getDbPool()` elsewhere in the app. I am putting the `pool` in the `locals` object and wanted to make sure that didn't defeat the purpose of the singleton object.

**Answer**

The short answer is: **No, this does not defeat the purpose of the singleton pattern. In fact, what you are doing is the idiomatic, recommended way to handle shared resources like database connections in SvelteKit.**

Let's break down why this works perfectly and is considered a best practice.

### Why Your Pattern is Correct

Your code is leveraging two separate concepts that work together beautifully:

1.  **Module Scope (for the Singleton):** Node.js caches modules. When you do `import { getDbPool } from '$lib/server/db.js';` and then `const pool = getDbPool();` at the top level of your `hooks.server.js` file, that code runs **once** when your server process starts. The `pool` variable in your hooks file holds the single, shared instance of the database pool for the entire lifetime of the server. This correctly implements the singleton pattern.

2.  **Request Scope (for `event.locals`):** The `handle` hook runs for **every incoming request**. The `event` object, including `event.locals`, is created fresh for each request and destroyed after the response is sent.

When you do `event.locals.pool = pool;`, you are **not creating a new pool**. You are simply taking the single, shared `pool` object that already exists in your module's memory and attaching a *reference* to it to the current request's `locals` object.

Think of it like this:
*   You have **one** central library in a city (the singleton `pool` instance).
*   Every person who visits the city (an incoming request) gets a library card (`event.locals`) that points them to the one and only library.
*   You aren't building a new library for every person. You're just giving them a cheap, easy way to access the existing one.

### The Advantages of Your Approach (Dependency Injection)

This pattern is a form of **Dependency Injection**, and it's highly beneficial:

1.  **Decoupling:** Your route handlers (`+server.js`, `+page.server.js`) don't need to know *how* to create or get the database connection. They are "dumb" in that respect. They just know to expect it on `event.locals`. This makes your code cleaner and easier to reason about.

2.  **Testability:** This pattern makes testing your endpoints much easier. You can create a mock database pool in your test setup and just place it on the `event.locals` object, without your endpoint code ever knowing the difference.

3.  **Centralized Logic:** All the logic for initializing and managing the database connection is in one place (`hooks.server.js` and `lib/server/db.js`). If you need to add logging, monitoring, or other logic around the pool, you have a single place to do it.

### Pro-Tip: Add Type-Safety

To make this pattern even better and get full autocompletion in your editor, you should declare the shape of `event.locals` in your `src/app.d.ts` file.

**`src/app.d.ts`**
```typescript
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Pool } from 'pg'; // Or the type from your specific DB driver/ORM

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pool: Pool; // Add your property here
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
```

Now, when you type `event.locals.` inside any of your server-side SvelteKit files, your editor will know that a `pool` property exists and what its type is.

### Complete Example Flow

Here's how your excellent pattern looks from start to finish:

**1. The Singleton (`src/lib/server/db.js`)**
```javascript
import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';

let pool;

export function getDbPool() {
  if (!pool) {
    pool = new pg.Pool({ connectionString: DATABASE_URL });
  }
  return pool;
}
```

**2. The Hook (`src/hooks.server.js`)**
```javascript
import { getDbPool } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

// This runs ONCE when the server starts
const pool = getDbPool();

export const handle: Handle = async ({ event, resolve }) => {
	// This runs for EVERY request
	// It attaches a REFERENCE to the single pool instance
	event.locals.pool = pool;

	const response = await resolve(event);
	return response;
};
```

**3. The Endpoint (`src/routes/api/users/+server.js`)**
```javascript
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	// Get the pool from locals (no imports needed!)
	const { pool } = locals;

	const result = await pool.query('SELECT * FROM users');

	return json(result.rows);
}
```

**Conclusion:** Keep doing what you're doing. It is the correct, efficient, and maintainable way to manage shared resources like a database pool within a SvelteKit application. You have successfully avoided the listener leak while implementing a clean, testable architecture.