---
title: Protected routes in Sveltekit
description: Protected routes in Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
[From a thread on Discord]
hooks.server.[js][ts] will run before any page is loaded (any request, but not relevant now)
then you can get the session id from cookies and get the current session via that, then once you have the session you can check the url and if the person with a certain session is accessing a certain url and you don't want that to happen you can redirect that user

This is a pattern I often follow:

```
const PROTECTED_ROUTES = [..., ..., ...];

export const handle: Handle = async ({ event, resolve }) => {
    const url = event.url.pathname;
    const session = getSession(event.request);
    PROTECTED_ROUTES.forEach(route => {
        if (url.startsWith(route) && !session) {
          // Non logged in user trying to access the protected route
      }
    });
    return await resolve(event);
}
```