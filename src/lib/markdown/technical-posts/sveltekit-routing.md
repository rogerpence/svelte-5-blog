---
title: Sveltekit dynamic routing and fetching the url.
description: Sveltekit dynamic routing and fetching the url.
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - sveltekit
---
Consider a dynamic route like this:

![[image.png]]

Without constraints, `[name]` can be any value. See [[Using Sveltekit ParamMatcher to constraint dynamic routes]] for more info on constraining dynamic routes.

In a +page.server.ts or +server.ts file, fetch the `url` like this:

```
export async function load({ url }): Promise<{ todos: Custom.Todo[] }> {
    console.log('url', url);
```

The following properties comprise the `url` value:

```
URL {
  href: 'http://localhost:5173/test-dyno/bob?state=ca',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  pathname: '/test-dyno/bob',
  search: '?state=ca',
  searchParams: URLSearchParams { 'state' => 'ca' },
  hash: ''
}
```

For example, fetch the `pathname` with:

```
const path = url.pathname;
```