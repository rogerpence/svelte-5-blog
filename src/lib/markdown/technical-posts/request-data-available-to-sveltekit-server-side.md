---
title: Sveltekit server-side load event
description: Sveltekit server-side load event
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
In a server-side SvelteKit file (+page.server.js in this case), the `event` argument provides all kinds of information about the request .

```
export const load = async (event) => {
	console.log('test=>', event);

	const form = await superValidate(event, contactFormSchema);

	return {
		form
	};
};
```

This the data available in the `event` argument. I think the arg is poorly named in this case, but still, this is the data that's available.

```
cookies: {
    get: [Function: get],
    getAll: [Function: getAll],
    set: [Function: set],
    delete: [Function: delete],
    serialize: [Function: serialize]
  },
  fetch: [Function: fetch],
  getClientAddress: [Function: getClientAddress],
  locals: { locale: 'en' },
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
      url: URL {}
    },
    [Symbol(signal)]: AbortSignal { aborted: false },
    [Symbol(headers)]: HeadersList {
      cookies: null,
      [Symbol(headers map)]: [Map],
      [Symbol(headers map sorted)]: null
    }
  },
  route: { id: '/en/test' },
  setHeaders: [Function: setHeaders],
  url: URL {
    href: 'http://localhost:5173/en/test',
    origin: 'http://localhost:5173',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:5173',
    hostname: 'localhost',
    port: '5173',
    pathname: '/en/test',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
  },
  isDataRequest: false,
  isSubRequest: false,
  depends: [Function: depends],
  parent: [AsyncFunction: parent]
}
```

For example, to get the URL for a redirect to the current URL, use `event.route.id`