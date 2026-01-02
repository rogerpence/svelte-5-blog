---
title: Putting the Postgres connection pool in the SvelteKit context object
description: Putting the Postgres connection pool in the SvelteKit context object
date_created: 2025-06-07T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - postgres
---
The database pool is placed into the `locals` context via the SvelteKit `handle` hook in your `hooks.server.ts` file. Let's examine how this works:

## The Flow:

1. **Pool Initialization**
   In `hooks.server.ts`, the PostgreSQL pool is created once when the server starts:
   ```typescript
   // Create the pool once when the server starts
   const pool = new Pool({
     host: PG_HOST,
     port: Number(PG_PORT) || 5432,
     user: PG_USER,
     password: PG_PASSWORD,
     database: PG_DATABASE,
     ssl: false
   });
   ```

2. **Adding to `locals` in the Handle Hook**
   The pool is then added to `event.locals` in the handle hook:
   ```typescript
   export const handle: Handle = async ({ event, resolve }) => {
     // Make the pool available to all server-side endpoints
     event.locals.pool = pool;
     
     event.locals.logger = logger;
     
     // Continue processing the request
     const response = await resolve(event);
     
     return response;
   };
   ```

3. **Accessing in Route Handlers**
   In your route handler files (like +page.server.ts), you access it via the `locals` parameter:
   ```typescript
   export const load: PageServerLoad = async ({ locals }) => {
     const pool = locals.pool;
     // Use the pool
   };
   ```

## Important Points:

- `locals` is a server-only context object that exists per-request
- It's different from Svelte's component context (via `getContext`/`setContext`)
- The pool is created once at server startup and reused across all requests
- Only server-side code can access `locals` (endpoints, +page.server.ts, `+layout.server.ts`, etc.)
- Client-side components cannot directly access the database pool

This pattern effectively gives you a singleton pool that's available throughout the server-side of your SvelteKit application without having to pass it around explicitly or create it multiple times.

# Using Svelte 5 Runes for Postgres Pool

You can't directly put a Postgres pool in a Svelte 5 rune for universal access, as database connections should only exist on the server side. Here's why and what to do instead:

## Why Not Use Runes for Database Connections

1. **Security**: Client-side JavaScript should never have direct database access
2. **Architecture**: Postgres connections are server-only resources
3. **Performance**: Database connections are heavyweight and not appropriate for client-side code

## Recommended Approach

Instead, create a server-only data access layer:

### 1. Create a Server-Only API Service

> [!info]
> See above for how to put the Postgres pool in the context object.

```typescript
import { getContext } from 'svelte';
import type { Pool } from 'pg';

// Server-only: Create typed functions to access database
export async function queryDatabase<T>(sql: string, params: any[] = []): Promise<T[]> {
  // This works in server-side components, +page.server.ts, +layout.server.ts
  const locals = getContext('locals');
  const pool = locals?.pool as Pool;
  
  if (!pool) {
    throw new Error('Database pool not available');
  }
  
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}
```

### 2. For Server Components (Svelte 5)

```svelte
<script>
  import { queryDatabase } from '$lib/server/db-service';
  import { onMount } from 'svelte';
  
  let families = $state([]);
  let loading = $state(true);
  let error = $state(null);
  
  // Server-only function
  async function loadFamilies() {
    try {
      families = await queryDatabase('SELECT * FROM family ORDER BY sort_order');
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  }
  
  onMount(loadFamilies);
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="error">{error}</p>
{:else}
  <ul>
    {#each families as family}
      <li>{family.name}</li>
    {/each}
  </ul>
{/if}
```

### 3. For Universal Components (Client + Server)

For components that need to run on both client and server, use SvelteKit's data loading pattern:

```typescript
export const load = async ({ locals }) => {
  const { pool } = locals;
  
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM family ORDER BY sort_order');
      return { 
        families: result.rows 
      };
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      families: [],
      error: error.message
    };
  }
};
```

```svelte
<script>
  export let data;
  
  const { families, error } = data;
</script>

{#if error}
  <p class="error">{error}</p>
{:else}
  <ul>
    {#each families as family}
      <li>{family.name}</li>
    {/each}
  </ul>
{/if}
```

This approach maintains the proper separation between client and server code while leveraging Svelte 5's runes when appropriate.