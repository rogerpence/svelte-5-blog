---
title: Putting the Pino logger object in the locals object for Sveltekit
description: Putting the Pino logger object in the locals object for Sveltekit
date_created: 2025-06-07T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - logging
  - pino
  - svelte
---
# Using Pool in Both Locals and Context in SvelteKit

You **cannot** directly use Svelte's context API (`setContext`/`getContext`) in your `hooks.server.ts` file. The Svelte context API is component-based and only available within the component tree, while `hooks.server.ts` operates outside the component system.

Here are your options:

## Option 1: Enhanced Local Logger (Recommended)

Create a request-specific logger in your handle hook that already has the pool injected:

````typescript
export const handle: Handle = async ({ event, resolve }) => {
  // Make the pool available to all server-side endpoints
  event.locals.pool = pool;
  
  // Create an enhanced logger with pool pre-bound
  event.locals.logger = {
    ...logger,
    // Pre-bound methods that don't need pool to be passed each time
    info: (message: string, data?: any) => logger.info(message, data, pool),
    error: (message: string, data?: any) => logger.error(message, data, pool),
    warn: (message: string, data?: any) => logger.warn(message, data, pool),
    debug: logger.debug, // No change needed since debug doesn't use pool
    // Keep original methods available too
    withPool: logger
  };
  
  // Continue processing the request
  const response = await resolve(event);
  
  return response;
};
````

Then in your route handlers:

```typescript
export const load = async ({ locals }) => {
  // No need to pass the pool
  locals.logger.info('Page loaded', { page: 'read' });
  
  // ...rest of your code
};
```

## Option 2: Singleton Module Pattern

If you want the pool available across your application without passing it, create a singleton module:

````typescript
import type { Pool } from 'pg';
import { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } from '$env/static/private';
import pkg from 'pg';

const { Pool: PgPool } = pkg;

// Singleton instance
let pool: Pool | null = null;

// Initialize the pool
export function getPool(): Pool {
  if (!pool) {
    pool = new PgPool({
      host: PG_HOST,
      port: Number(PG_PORT) || 5432,
      user: PG_USER,
      password: PG_PASSWORD,
      database: PG_DATABASE,
      ssl: false
    });
    
    // Set up error handler
    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
    });
  }
  
  return pool;
}

// Cleanup function for graceful shutdown
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
}
````

Then modify your pino-logger to use this:

```typescript
import { getPool } from '$lib/server/db';

// In your logger methods
info: (message: string, data?: any, explicitPool?: Pool) => {
  pinoLogger.info(data || {}, message);
  
  const pool = explicitPool || getPool();
  if (!dev) {
    logToDB(pool, 'info', message, data).catch((e) =>
      pinoLogger.error('Failed to write to DB: ' + e.message)
    );
  }
}
```

## Option 3: For Server Components

In actual server components (not hooks), you can use the Svelte context API:

```svelte
<!-- In a +layout.svelte file -->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  export let data;
  
  // Make pool available via context if needed in server components
  setContext('pool', data.pool);
</script>

<slot />
```

Then in server components (not client components):

```svelte
<script>
  import { getContext } from 'svelte';
  import { logger } from '$lib/pino-logger';
  
  const pool = getContext('pool');
  
  // Now you can use the pool with logger
  logger.info('Component mounted', { component: 'MyServerComponent' }, pool);
</script>
```

Option 1 is the most SvelteKit-idiomatic approach and avoids globals while maintaining type safety.



This approach creates a request-specific enhanced logger that has the database pool pre-bound to the logging methods. Let me break down how it works and why it's useful:

## How It Works

```typescript
event.locals.logger = {
  ...logger,
  info: (message: string, data?: any) => logger.info(message, data, pool),
  error: (message: string, data?: any) => logger.error(message, data, pool),
  warn: (message: string, data?: any) => logger.warn(message, data, pool),
  debug: logger.debug,
  withPool: logger
};
```

1. **Object Spread (`...logger`)**: 
   - Copies all properties and methods from your original logger
   - Ensures you don't lose any existing functionality

2. **Method Overrides**:
   - Replaces the default methods with new functions
   - These new functions call the original methods but automatically include the pool
   - Creates a partial application/currying of the original functions

3. **Unchanged Methods**:
   - `debug` doesn't need the pool, so it's directly referenced
   - No wrapper function needed

4. **Original Logger Access**:
   - `withPool: logger` keeps a reference to the original logger
   - Useful if you need the original behavior in some cases

## Benefits

1. **Simplified Usage**: You no longer need to pass the pool parameter every time:
   ```typescript
   // Instead of this:
   locals.logger.info('User logged in', { userId: 123 }, locals.pool);
   
   // You can do this:
   locals.logger.info('User logged in', { userId: 123 });
   ```

2. **Fewer Errors**: Eliminates forgetting to pass the pool parameter

3. **Better Encapsulation**: Implementation details are hidden from route handlers

4. **Type Safety**: TypeScript still enforces the correct parameter types

5. **Flexibility**: Original logger still available via `locals.logger.withPool`

## Implementation in Your Code

To update your current code:

```typescript
export const handle: Handle = async ({ event, resolve }) => {
  // Make the pool available to all server-side endpoints
  event.locals.pool = pool;

  // Enhanced logger with pre-bound pool
  event.locals.logger = {
    ...logger,
    info: (message: string, data?: any) => logger.info(message, data, pool),
    error: (message: string, data?: any) => logger.error(message, data, pool),
    warn: (message: string, data?: any) => logger.warn(message, data, pool),
    debug: logger.debug,
    testDbLogging: () => logger.testDbLogging(pool),
    withPool: logger // Original logger
  };

  // Continue processing the request
  const response = await resolve(event);

  return response;
};
```

This technique is a form of the "Dependency Injection" pattern where you're pre-configuring dependencies at a higher level to simplify usage at lower levels.

# Object Spread Operator in the Enhanced Logger Configuration

The `...logger` part in the enhanced logger configuration is using JavaScript's object spread syntax to copy all properties and methods from your original logger into the new enhanced logger object.

## What It Does

When you use `...logger` inside a new object literal:

```typescript
event.locals.logger = {
  ...logger,
  // other properties and methods
};
```

It effectively:

1. **Creates a shallow copy** of all the original logger's properties and methods
2. **Preserves all the existing functionality** of your original logger
3. **Sets up the foundation** before you override or add specific methods

## In Your Enhanced Logger Context

```typescript
event.locals.logger = {
  ...logger,  // <-- This part
  info: (message, data) => logger.info(message, data, pool),
  // other methods
};
```

Without the `...logger` spread, your new logger object would only have the methods you explicitly define (info, error, warn) and would lose any other methods or properties from the original logger (like `db`, `testDbLogging`, etc.).

By spreading the original logger first, you ensure that any methods you don't explicitly redefine remain accessible in your enhanced logger.

This pattern gives you the best of both worlds:
1. All the original functionality remains available
2. Selected methods are enhanced with the pre-bound pool parameter

## releasing the pool

In this code, where 'pool' came from 'locals.pool,' you don't need to release the pool

```
async function logToDB(pool: Pool, level: string, message: string, data?: any) {
	try {
		await pool.query(
			'INSERT INTO app_logs (level, message, data, timestamp) VALUES ($1, $2, $3, NOW())',
			[level, message, data ? JSON.stringify(data) : null]
		);
	} catch (err) {
		pinoLogger.error({ err }, 'Failed to write log to database');
	}
}
```

However, if you do this, you need to release the client (the above method is the best pattern.)

```
// ❌ This pattern requires manual release
async function logToDB(pool: Pool, level: string, message: string, data?: any) {
    const client = await pool.connect(); // Get a specific client
    try {
        await client.query(
            'INSERT INTO app_logs (level, message, data, timestamp) VALUES ($1, $2, $3, NOW())',
            [level, message, data ? JSON.stringify(data) : null]
        );
    } finally {
        client.release(); // Must manually release
    }
}

```