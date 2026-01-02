---
title: Client side logging to the DB with Sveltekit and Pino
description: Client side logging to the DB with Sveltekit and Pino
date_created: 2025-06-07T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
---
To log from the client-side to your database using Pino, you'll need to create an API endpoint that receives log data and writes it to the database. Here's the recommended approach:

## 1. Create a Server-Side API Endpoint

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/pino-logger';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { pool } = locals;
  
  if (!pool) {
    return json({ success: false, message: 'Database connection unavailable' }, { status: 500 });
  }
  
  try {
    const { level, message, data } = await request.json();
    
    // Validate inputs
    if (!level || !message || !['info', 'warn', 'error', 'debug'].includes(level)) {
      return json({ success: false, message: 'Invalid log data' }, { status: 400 });
    }
    
    // Log using your server-side logger
    await logger.db(level, `[CLIENT] ${message}`, data, pool);
    
    return json({ success: true });
  } catch (error) {
    console.error('Error processing client log:', error);
    return json({ success: false, message: 'Failed to process log' }, { status: 500 });
  }
};
```

## 2. Create a Client-Side Logger

```typescript
export const clientLogger = {
  info: async (message: string, data?: any) => {
    await logToServer('info', message, data);
    console.info(message, data || '');
  },
  
  warn: async (message: string, data?: any) => {
    await logToServer('warn', message, data);
    console.warn(message, data || '');
  },
  
  error: async (message: string, data?: any) => {
    await logToServer('error', message, data);
    console.error(message, data || '');
  },
  
  debug: async (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      await logToServer('debug', message, data);
      console.debug(message, data || '');
    }
  }
};

async function logToServer(level: string, message: string, data?: any) {
  try {
    const response = await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        level,
        message,
        data: {
          ...data,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })
    });
    
    if (!response.ok) {
      console.error('Failed to send log to server:', await response.text());
    }
  } catch (err) {
    // Silently fail - we don't want logging to break the application
    console.error('Error sending log to server:', err);
  }
}
```

## 3. Usage in Your Svelte Components

```svelte
<script>
  import { clientLogger } from '$lib/client-logger';
  
  function handleClick() {
    clientLogger.info('Button clicked', { buttonId: 'main-action' });
    // Rest of your code
  }
  
  function handleError(e) {
    clientLogger.error('Form submission failed', { 
      formData: JSON.stringify($form),
      error: e.message
    });
  }
</script>

<button on:click={handleClick}>Click Me</button>
```

## 4. Best Practices

1. **Batch logs** when possible to reduce API calls
2. **Add throttling** to prevent overwhelming your server
3. **Include contextual data** like URL, user agent, and timestamp
4. **Handle network failures gracefully** 
5. **Consider privacy implications** of what you log from the client
6. **Add authentication/authorization** to your logging endpoint

This approach gives you a robust client-side logging system that persists logs to your database while maintaining the structure and benefits of your Pino logger.