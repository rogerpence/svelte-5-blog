---
title: SvelteKit logging with Pino
description: SvelteKit logging with Pino
date_created: 2025-06-07T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - pino
  - svelte
---
## Logging for Your SvelteKit Application

For your SvelteKit application that needs to log to Postgres, Pino is indeed a good choice, but there are some considerations:

## Using Pino (Recommended)

Pino is an excellent choice because:

1. **Performance**: It's one of the fastest Node.js loggers available
2. **JSON output**: Makes it easy to parse and store logs
3. **Low overhead**: Minimal impact on your application
4. **Transport system**: Allows you to send logs to different destinations
5. **Mature ecosystem**: Well-maintained with good community support

For your PostgreSQL integration, you can use:

```typescript
import pino from 'pino';
import { pool } from '$lib/db'; // Your Postgres connection

// Create the base logger
const logger = pino({
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  // Customize log format as needed
});

// Add custom method to log to database
const dbLogger = logger.child({});

// Extend with a method to save to DB
dbLogger.db = async (level: string, message: string, data?: any) => {
  try {
    await pool.query(
      'INSERT INTO app_logs (level, message, data, timestamp) VALUES ($1, $2, $3, NOW())',
      [level, message, data ? JSON.stringify(data) : null]
    );
  } catch (err) {
    logger.error({ err }, 'Failed to write log to database');
  }
  
  // Also log to console
  dbLogger[level](data || {}, message);
};

export { dbLogger as logger };
```

Then in your global-listener.svelte.ts:

```typescript
import { browser } from '$app/environment';
import * as ListenerTypes from '$lib/types/listener-types';
import { logger } from '$lib/utils/logger';

// Define the structure of our store's state
type GlobalListener = {
	showContactForm: boolean;
	showToast: boolean; // Optional: Add more properties as needed
	payload?: ListenerTypes.DialogCargo | ListenerTypes.ToastCargo;
};

// Create the reactive state using $state
// Initialize with a default value
let appStore = $state<GlobalListener>({
	showContactForm: false,
	showToast: false // Optional: Initialize other properties as needed
});

// Optional: Log when the store module is loaded
if (browser) {
	logger.info('Shared store module loaded (client)');
} else {
	logger.info('Shared store module loaded (server)');
	
	// Example of DB logging for important server events
	logger.db('info', 'Store module initialized', { environment: 'server' });
}

// Action creators with logging
export function showToast(toast: ListenerTypes.ToastCargo) {
    logger.db('info', 'Toast displayed', { type: toast.toastType, heading: toast.heading });
    globalState.payload = toast;
    globalState.showToast = true;
}

export function showDialog(dialog: ListenerTypes.DialogCargo) {
    logger.db('info', 'Dialog displayed', { type: dialog.dialogType, heading: dialog.heading });
    globalState.payload = dialog;
    globalState.showContactForm = true;
}

export const globalState = appStore;
```

## Writing Your Own Logger?

Writing your own basic logger is **not silly** if your needs are truly minimal. However:

1. **Time investment**: Even a simple logger requires time to build, test, and maintain
2. **Edge cases**: Production logging has many edge cases (like async context, error handling)
3. **Features**: You'll likely want more features later (filtering, formatting, etc.)

If you really want a minimal DIY approach:

```typescript
// Simple DIY logger that writes to Postgres
export const logger = {
  async log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}]: ${message}`, data || '');
    
    try {
      await pool.query(
        'INSERT INTO app_logs (level, message, data, timestamp) VALUES ($1, $2, $3, $4)',
        [level, message, data ? JSON.stringify(data) : null, timestamp]
      );
    } catch (err) {
      console.error('Failed to write log to database:', err);
    }
  },
  
  info(message: string, data?: any) {
    return this.log('info', message, data);
  },
  
  error(message: string, data?: any) {
    return this.log('error', message, data);
  },
  
  warn(message: string, data?: any) {
    return this.log('warn', message, data);
  },
  
  debug(message: string, data?: any) {
    return this.log('debug', message, data);
  }
};
```

## Recommendation

I recommend starting with Pino - it gives you a solid foundation with minimal code and allows you to easily extend it as your needs grow. The time you save can be spent on your application's core features.

Remember to create your Postgres table:

```sql
CREATE TABLE app_logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(10) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  timestamp TIMESTAMP NOT NULL
);
CREATE INDEX idx_app_logs_level ON app_logs(level);
CREATE INDEX idx_app_logs_timestamp ON app_logs(timestamp);
```

## Making Pino globally available in SvelteKit components


To make the Pino logger globally available to all SvelteKit components, you need to set it up in a way that makes it easy to import and use throughout your application. Here's how to structure this:

## 1. Create a Central Logger Module

First, create a dedicated logger module:

```typescript
import pino from 'pino';
import { dev } from '$app/environment';
import { pool } from '$lib/db'; // Your Postgres connection

// Configure base logger with appropriate options
const pinoLogger = pino({
  level: dev ? 'debug' : 'info',
  transport: dev ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Create the logger with DB capabilities
const logger = {
  // Base logging methods
  info: (message: string, data?: any) => {
    pinoLogger.info(data || {}, message);
    if (!dev) logToDB('info', message, data).catch(e => 
      pinoLogger.error('Failed to write to DB: ' + e.message));
  },
  
  error: (message: string, data?: any) => {
    pinoLogger.error(data || {}, message);
    if (!dev) logToDB('error', message, data).catch(e => 
      pinoLogger.error('Failed to write to DB: ' + e.message));
  },
  
  warn: (message: string, data?: any) => {
    pinoLogger.warn(data || {}, message);
    if (!dev) logToDB('warn', message, data).catch(e => 
      pinoLogger.error('Failed to write to DB: ' + e.message));
  },
  
  debug: (message: string, data?: any) => {
    pinoLogger.debug(data || {}, message);
    // Usually don't log debug messages to DB
  },
  
  // Direct DB logging (when you only want to log to DB)
  db: (level: string, message: string, data?: any) => {
    pinoLogger[level](data || {}, message);
    return logToDB(level, message, data);
  }
};

// Helper function to log to database
async function logToDB(level: string, message: string, data?: any) {
  try {
    await pool.query(
      'INSERT INTO app_logs (level, message, data, timestamp) VALUES ($1, $2, $3, NOW())',
      [level, message, data ? JSON.stringify(data) : null]
    );
  } catch (err) {
    pinoLogger.error({ err }, 'Failed to write log to database');
  }
}

// Export the logger
export { logger };
```

## 2. Attach to the SvelteKit Context in Hooks

To make it available on every request, add it to the `event.locals` in your hooks file:

```typescript
import type { Handle } from '@sveltejs/kit';
import { globalState } from '$lib/components/global-listener.svelte';
import { logger } from '$lib/utils/logger';

// Extend the App.Locals interface to include our logger
declare global {
  namespace App {
    interface Locals {
      logger: typeof logger;
    }
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  // Attach logger to event.locals so it's available in load functions and actions
  event.locals.logger = logger;
  
  // Reset the contact form state on every request
  globalState.showContactForm = false;
  
  // Log each request
  logger.info(`Request: ${event.request.method} ${event.url.pathname}`, {
    query: Object.fromEntries(event.url.searchParams),
    userAgent: event.request.headers.get('user-agent')
  });

  const response = await resolve(event);
  return response;
};
```

## 3. Use in Server Components and Load Functions

In server-side code, you can access the logger from `event.locals`:

```typescript
// In a +page.server.ts file
export const load = async ({ locals }) => {
  locals.logger.info('Loading page data');
  
  // Your load function logic...
  
  return { /* data */ };
};
```

## 4. Create a Client-Side Wrapper

For client components, create a simplified client-side version:

```typescript
import { browser } from '$app/environment';

// Simplified client-side logger
export const logger = {
  info: (message: string, data?: any) => {
    if (browser) console.info(`[INFO] ${message}`, data || '');
  },
  
  error: (message: string, data?: any) => {
    if (browser) console.error(`[ERROR] ${message}`, data || '');
  },
  
  warn: (message: string, data?: any) => {
    if (browser) console.warn(`[WARN] ${message}`, data || '');
  },
  
  debug: (message: string, data?: any) => {
    if (browser) console.debug(`[DEBUG] ${message}`, data || '');
  }
};
```

## 5. Update Your Global State to Use the Logger

```typescript
import { browser } from '$app/environment';
import * as ListenerTypes from '$lib/types/listener-types';
import { logger } from '$lib/utils/client-logger'; // Use client logger for browser code

// Define the structure of our store's state
type GlobalListener = {
	showContactForm: boolean;
	showToast: boolean;
	payload?: ListenerTypes.DialogCargo | ListenerTypes.ToastCargo;
};

let appStore = $state<GlobalListener>({
	showContactForm: false,
	showToast: false
});

if (browser) {
	logger.info('Shared store module loaded (client)');
} else {
	// This won't run in browser environments
	logger.info('Shared store module loaded (server)');
}

// Action creators with logging
export function showToast(toast: ListenerTypes.ToastCargo) {
    logger.info('Toast displayed', { type: toast.toastType, heading: toast.heading });
    globalState.payload = toast;
    globalState.showToast = true;
}

export function showDialog(dialog: ListenerTypes.DialogCargo) {
    logger.info('Dialog displayed', { type: dialog.dialogType, heading: dialog.heading });
    globalState.payload = dialog;
    globalState.showContactForm = true;
}

export const globalState = appStore;
```

## 6. Import and Use in Components

Now you can use the logger in any component:

```svelte
<script>
    import { logger } from '$lib/utils/client-logger';
    
    function handleClick() {
        logger.info('Button clicked');
        // Do something
    }
</script>

<button on:click={handleClick}>Click me</button>
```

This architecture provides:

1. **Server-side logging**: Full Pino capabilities with DB integration
2. **Client-side logging**: Simplified console logging
3. **Consistent API**: Same method calls regardless of environment
4. **Global availability**: Easy to import and use anywhere
5. **Type safety**: TypeScript interfaces for both environments

For optimal flexibility, you can also create a logging context that can be provided to components through Svelte's context API if you prefer that approach over imports.

# Why `logger.testDbLogging` Uses Await But `logger.info` Doesn't

The difference in usage comes from their implementation and return values:

## 1. `logger.info` Function
```typescript
info: (message: string, data?: any, pool?: Pool) => {
    pinoLogger.info(data || {}, message);
    if (!dev && pool)
        logToDB(pool, 'info', message, data).catch((e) =>
            pinoLogger.error('Failed to write to DB: ' + e.message)
        );
}
```

This function:
- **Doesn't return a Promise**: It returns `undefined` (void)
- **Uses fire-and-forget pattern**: The database operation happens asynchronously
- **Handles errors internally**: Uses `.catch()` to capture errors within the function
- **Is designed for regular logging**: Not meant to block execution flow

## 2. `logger.testDbLogging` Function
```typescript
testDbLogging: async (pool: Pool) => {
    pinoLogger.info('Testing DB logging');
    
    try {
        await logToDB(pool, 'info', 'Test DB write from pino-logger', {
            timestamp: new Date().toISOString()
        });
        pinoLogger.info('Successfully wrote test log to database');
        return true;
    } catch (err: any) {
        pinoLogger.error({ err }, 'Failed to write test log to database');
        return false;
    }
}
```

This function:
- **Is declared as async**: Returns a Promise
- **Returns a value**: `true` or `false` based on success
- **Waits for completion**: Uses `await` to ensure the database write completes
- **Is designed for testing**: Specifically to verify DB writing functionality

## Best Practice

This is intentional design. For normal logging functions, you typically don't want to await them since logging should not block your application flow. For test functions, you want to know the result, so you await the Promise to get the true/false result.

If you wanted to know when a log was successfully written to the database in your normal code flow, you would need to modify the regular logging functions to return Promises and then await them.