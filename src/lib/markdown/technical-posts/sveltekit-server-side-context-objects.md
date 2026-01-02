---
title: SvelteKit context and locals server-side objects
description: SvelteKit context and locals server-side objects
date_created: '2025-06-07T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
# Server-Side Context Objects in SvelteKit

Yes, you're correct. There are two main types of context objects in SvelteKit, and both are server-side only:

## 1. `locals` Object
- **Server-side only**: Available only in server-side code
- **Per-request**: Each request gets its own `locals` object
- **Set in hooks**: Populated via the `handle` hook in `hooks.server.ts`
- **Accessible in**: 
  - Server route handlers (`+page.server.ts`, `+layout.server.ts`)
  - API endpoints (`+server.ts`)
  - Server hooks
- **Not accessible in**: Client-side components or code

## 2. Svelte Context API
- The standard Svelte context API (`getContext`/`setContext`)
- When used in SvelteKit server components, it only works on the server
- Not shared between client and server

Your pino-logger.ts implementation correctly handles this by requiring the pool to be passed explicitly, rather than trying to access it from a context that might not be available:

```typescript
info: (message: string, data?: any, pool?: Pool) => {
    pinoLogger.info(data || {}, message);
    if (!dev && pool)
        logToDB(pool, 'info', message, data).catch((e) =>
            pinoLogger.error('Failed to write to DB: ' + e.message)
        );
}
```

This is a good design because:
1. It makes dependencies explicit
2. It works in both server and client contexts
3. It's more testable and maintainable

If you wanted to reduce the need to pass the pool explicitly, you could enhance your logger in `hooks.server.ts` to create a request-specific logger with the pool already bound:

```typescript
export const handle: Handle = async ({ event, resolve }) => {
    event.locals.pool = pool;
    event.locals.logger = {
        ...logger,
        // Pre-bind the pool to the logger methods
        reqInfo: (message: string, data?: any) => logger.info(message, data, pool),
        reqError: (message: string, data?: any) => logger.error(message, data, pool),
        reqWarn: (message: string, data?: any) => logger.warn(message, data, pool)
    };
    
    const response = await resolve(event);
    return response;
};
```