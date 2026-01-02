---
title: HTTP context API in Sveltekit
description: HTTP context API in Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Example data returned from HTTP context object in Sveltekit Get method

```
import { json } from '@sveltejs/kit';

export async function GET(context) {
	console.log(context);
	return json('roger');
}
```

```js
{
  cookies: {
    get: [Function: get],
    getAll: [Function: getAll],
    set: [Function: set],
    delete: [Function: delete],
    serialize: [Function: serialize]
  },
  fetch: [AsyncFunction (anonymous)],
  getClientAddress: [Function: getClientAddress],
  locals: {},
  params: {},
  platform: undefined,
  request: Request {
    [Symbol(realm)]: { settingsObject: [Object] },
    [Symbol(state)]: {
      method: 'GET',
      localURLsOnly: false,
      unsafeRequest: false,
      body: null,
      client: [Object],
      reservedClient: null,
      replacesClientId: '',
      window: 'client',
      keepalive: false,
      serviceWorkers: 'all',
      initiator: '',
      destination: '',
      priority: null,
      origin: 'client',
      policyContainer: 'client',
      referrer: 'client',
      referrerPolicy: '',
      mode: 'cors',
      useCORSPreflightFlag: false,
      credentials: 'same-origin',
      useCredentials: false,
      cache: 'default',
      redirect: 'follow',
      integrity: '',
      cryptoGraphicsNonceMetadata: '',
      parserMetadata: '',
      reloadNavigation: false,
      historyNavigation: false,
      userActivation: false,
      taintedOrigin: false,
      redirectCount: 0,
      responseTainting: 'basic',
      preventNoCacheCacheControlHeaderModification: false,
      done: false,
      timingAllowFailed: false,
      headersList: [HeadersList],
      urlList: [Array],
      url: [URL]
    },
    [Symbol(signal)]: AbortSignal { aborted: false },
    [Symbol(headers)]: HeadersList {
      cookies: null,
      [Symbol(headers map)]: [Map],
      [Symbol(headers map sorted)]: null
    }
  },
  route: { id: '/api/post' },
  setHeaders: [Function: setHeaders],
  url: URL {
    href: 'http://localhost:5173/api/post?slug=roger',
    origin: 'http://localhost:5173',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:5173',
    hostname: 'localhost',
    port: '5173',
    pathname: '/api/post',
    search: '?slug=roger',
    searchParams: URLSearchParams { 'slug' => 'roger' },
    hash: ''
  },
  isDataRequest: false,
  isSubRequest: false
}
```

Read the query string:

```
export async function GET(context) {
	const slug = context.url.searchParams.get('slug');
	...

```