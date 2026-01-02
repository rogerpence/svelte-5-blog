---
title: Pino Logger docs
description: Pino Logger docs
date_updated: '2025-12-13T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - pino
---
A custom Pino-based logging utility for SvelteKit applications with PostgreSQL database integration.

## Table of Contents
- [Pino Logger Documentation](#pino-logger-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Custom Log Levels](#custom-log-levels)
  - [API Reference](#api-reference)
    - [Standard Logging Methods](#standard-logging-methods)
    - [Database Logging Methods](#database-logging-methods)
  - [Usage Examples](#usage-examples)
    - [Basic Logging](#basic-logging)
    - [SvelteKit Integration](#sveltekit-integration)
    - [Download Tracking](#download-tracking)
  - [Type Definitions](#type-definitions)
  - [Error Handling](#error-handling)
  - [Best Practices](#best-practices)
  - [Performance Considerations](#performance-considerations)
  - [Troubleshooting](#troubleshooting)

## Overview

This logger provides a structured logging solution that uses Pino for high-performance logging, supports custom log levels including a "notice" level, provides pretty-printing in development mode, integrates with PostgreSQL for persistent log storage, and includes specialized logging for download tracking.

## Features

- **Environment-aware configuration**: Pretty logging in development, JSON in production
- **Custom log levels**: Standard levels plus a custom "notice" level (severity 35)
- **Database integration**: Optional PostgreSQL logging with automatic error handling
- **Type-safe**: Full TypeScript support with custom level types
- **Structured logging**: Consistent message and data format across all methods

## Installation

Ensure you have the required dependencies:

```bash
npm install pino pino-pretty pg
pnpm add pino pino-pretty pg
```

## Configuration

The logger is configured automatically based on the environment:

**Development Mode:**
- Log level: `debug`
- Output: Pretty-printed with colors via `pino-pretty`
- Timestamp: ISO 8601 format

**Production Mode:**
- Log level: `info`
- Output: JSON format
- Timestamp: ISO 8601 format

## Custom Log Levels

The logger includes a custom `notice` level with severity 35, positioned between `info` (30) and `warn` (40):

```typescript
type CustomLevels = Level | 'notice';
```

## API Reference

### Standard Logging Methods

All standard methods accept a message and optional data object.

**`logger.info(message: string, data?: any)`**

Logs informational messages.

```typescript
logger.info('User logged in', { userId: 123, username: 'john' });
```

**`logger.notice(message: string, data?: any)`**

Logs important notices that are not warnings.

```typescript
logger.notice('Rate limit approaching', { currentRate: 95, threshold: 100 });
```

**`logger.error(message: string, data?: any)`**

Logs error messages.

```typescript
logger.error('Database connection failed', { error: err.message });
```

**`logger.warn(message: string, data?: any)`**

Logs warning messages.

```typescript
logger.warn('Deprecated API usage', { endpoint: '/old-api', userId: 456 });
```

**`logger.debug(message: string, data?: any)`**

Logs debug information (only in development by default).

```typescript
logger.debug('Processing request', { requestId: 'abc123', params });
```

### Database Logging Methods

**`logger.db(pool: Pool, message: string, data?: any): Promise<void>`**

Logs to both console and database simultaneously.

```typescript
import { pool } from '$lib/db';

await logger.db(pool, 'Payment processed', { 
  amount: 99.99, 
  currency: 'USD',
  orderId: 'order_123' 
});
```

**Database Schema Requirements:**
```sql
CREATE TABLE app_logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  timestamp TIMESTAMP NOT NULL
);
```

**`logger.download(pool: Pool, name: string, company: string, country: string, email_address: string, product: string, family: string): Promise<void>`**

Specialized method for logging product downloads.

```typescript
await logger.download(
  pool,
  'John Doe',
  'Acme Corp',
  'USA',
  'john@acme.com',
  'Product-X',
  'Electronics'
);
```

**Database Schema Requirements:**
```sql
CREATE TABLE downloads_log (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  company VARCHAR(255),
  country VARCHAR(100),
  email_address VARCHAR(255),
  product VARCHAR(255),
  family VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## Usage Examples

### Basic Logging

```typescript
import logger from '$lib/pino-logger';

// Simple info log
logger.info('Application started');

// Log with context data
logger.error('Failed to fetch user', { userId: 123, error: 'Not found' });

// Notice level
logger.notice('System maintenance scheduled', { date: '2025-12-20' });
```

### SvelteKit Integration

**In hooks.server.ts:**

```typescript
import type { Handle } from '@sveltejs/kit';
import logger from '$lib/pino-logger';
import { pool } from '$lib/db';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.logger = logger;
  event.locals.pool = pool;

  logger.info('Request received', {
    path: event.url.pathname,
    method: event.request.method
  });

  const response = await resolve(event);
  
  return response;
};
```

**In +page.server.ts:**

```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  locals.logger.info('Page loaded', { page: 'home' });
  
  // With database logging
  await locals.logger.db(
    locals.pool,
    'User viewed homepage',
    { sessionId: locals.session?.id }
  );
  
  return {};
};
```

**In +server.ts (API Routes):**

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const data = await request.json();
    
    await locals.logger.db(
      locals.pool,
      'API request processed',
      { endpoint: '/api/users', data }
    );
    
    return json({ success: true });
  } catch (error) {
    locals.logger.error('API error', { error });
    return json({ error: 'Internal error' }, { status: 500 });
  }
};
```

### Download Tracking

```typescript
import type { Actions } from './$types';

export const actions = {
  download: async ({ request, locals }) => {
    const formData = await request.formData();
    
    await locals.logger.download(
      locals.pool,
      formData.get('name'),
      formData.get('company'),
      formData.get('country'),
      formData.get('email'),
      formData.get('product'),
      formData.get('family')
    );
    
    return { success: true };
  }
} satisfies Actions;
```

## Type Definitions

```typescript
import type { CustomLevels } from '$lib/pino-logger';

interface Logger {
  info: (message: string, data?: any) => void;
  notice: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  debug: (message: string, data?: any) => void;
  db: (pool: Pool, message: string, data?: any) => Promise<void>;
  download: (
    pool: Pool,
    name: string,
    company: string,
    country: string,
    email_address: string,
    product: string,
    family: string
  ) => Promise<void>;
}
```

## Error Handling

Database logging failures are caught and logged to the console but do not throw errors. If DB logging fails, the error is logged but the application continues normally:

```typescript
await logger.db(pool, 'Important event', { data });
// Application continues even if DB insert fails
```

## Best Practices

1. **Use appropriate log levels**: Use `debug` for detailed debugging info, `info` for general informational messages, `notice` for important notices, `warn` for warning conditions, and `error` for error conditions.

2. **Include context data**: Always provide relevant context with your logs.
   ```typescript
   // Good
   logger.error('Login failed', { username, ip, attempt });
   
   // Less useful
   logger.error('Login failed');
   ```

3. **Avoid logging sensitive data**: Never log passwords, API keys, or other sensitive information.
   ```typescript
   // Bad
   logger.info('User created', { password: '...' });
   
   // Good
   logger.info('User created', { userId, email });
   ```

4. **Use database logging for critical events**: Persist important events that you may need to query or analyze later.
   ```typescript
   await logger.db(pool, 'Payment received', { orderId, amount });
   ```

## Performance Considerations

- Pino is one of the fastest Node.js loggers available
- Database logging is asynchronous and non-blocking
- Pretty printing is automatically disabled in production for better performance
- Consider implementing log rotation strategies for database tables to manage storage

## Troubleshooting

**Logs not appearing in development:**
- Verify `dev` environment variable is `true`
- Check that log level is `debug` or lower

**Database logging fails silently:**
- Verify database connection pool is valid
- Check table schema matches required structure
- Review console for error messages from the logger

**TypeScript errors with custom levels:**
- Import the `CustomLevels` type: `import type { CustomLevels } from '$lib/pino-logger'`


*License: MIT*