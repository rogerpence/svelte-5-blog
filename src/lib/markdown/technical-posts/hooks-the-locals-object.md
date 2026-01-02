---
title: Sveltekit locals object
description: Sveltekit locals object
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Sveltelkit hooks are a way to intercept the incoming request pipeline. You can modify it or add things to it. In this case, the `zevon` variable is injected into the `locals` object.

> The `locals` object is a per-request object into which you can assign values you need persisted throughout the life of the request. A canonical `locals` example is capturing authentication-related values to have available later in the request.

file: `src/hooks.server.ts`

```
export const handle = async({event, resolve}) => {
    event.locals.zevon = "Excitable Boy"

    const response = await resolve(event);

 return response;
}
```

In the file below, the `zevon` variable is fetched in a `page.server.ts`

file: `page.server.ts`

```
export const load = async (event ) => {
    const form = await superValidate(event, newUserSchema)

    const w = event.locals.zevon

    return {form}
}
```



Here is another example using `hooks.server.ts`:

```ts
// src/app.d.ts
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            // To store user data
            user?: { 
                id: string;
                email: string;
            };
            // Add any other properties you want to set 
            // on event.locals
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
```

```ts
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Example: Try to get user from a cookie (pseudo-code)
    const sessionId = event.cookies.get('sessionid');
    if (sessionId) {
        const user = await getUserBySessionId(sessionId); 
        // Your auth logic
        if (user) {
             event.locals.user = { id: user.id, 
                                   email: user.email };
        }
    }

    const response = await resolve(event);
    return response;
};
```