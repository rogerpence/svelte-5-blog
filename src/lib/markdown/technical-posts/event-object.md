---
title: Svelte event object
description: Svelte event object
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
```
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
  route: { id: '/' },
  setHeaders: [Function: setHeaders],
  url: URL {
    href: 'http://localhost:5173/',
    origin: 'http://localhost:5173',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:5173',
    hostname: 'localhost',
    port: '5173',
    pathname: '/',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
  },
  isDataRequest: false,
  isSubRequest: false
}
12:55:31 PM [vite] page reload src/hooks.server.js (x4)
URL {
  href: 'http://localhost:5173/',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  pathname: '/',
  search: '',
  searchParams: URLSearchParams {},
  hash: ''
}
URL {
  href: 'http://localhost:5173/',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  pathname: '/',
  search: '',
  searchParams: URLSearchParams {},
  hash: ''
}
12:56:53 PM [vite] page reload src/hooks.server.js (x5)
/
/
/en
12:58:04 PM [vite] page reload src/hooks.server.js (x6)
/en
/
/en
1:12:09 PM [vite] page reload src/hooks.server.js (x7)
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
  route: { id: '/en' },
  setHeaders: [Function: setHeaders],
  url: URL {
    href: 'http://localhost:5173/en',
    origin: 'http://localhost:5173',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:5173',
    hostname: 'localhost',
    port: '5173',
    pathname: '/en',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
  },
  isDataRequest: false,
  isSubRequest: false
}
 ELIFECYCLE  Command failed with exit code 1.

 01:12  ~\svelte\focused-topics\layouts ✗  pnpm run dev

> postcss@0.0.1 dev C:\Users\thumb\Documents\Projects\svelte\focused-topics\layouts
> vite dev



  VITE v4.4.8  ready in 1733 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
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
  route: { id: '/en' },
  setHeaders: [Function: setHeaders],
  url: URL {
    href: 'http://localhost:5173/en',
    origin: 'http://localhost:5173',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:5173',
    hostname: 'localhost',
    port: '5173',
    pathname: '/en',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
  },
  isDataRequest: false,
  isSubRequest: false
}
```