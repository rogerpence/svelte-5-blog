---
title: Sveltekit miscellaneous things
description: Sveltekit miscellaneous things
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
## Accessing a page's HEAD section

This code injects or overwrites an attribute tag in the head section:

```
<svelte:head>
	<title>Home</title>
</svelte:head>
```

## Get page url info

```
<script lang="ts">
    import { page } from '$app/stores'
</script>

<h1>Posts</h1>

<pre>
    {JSON.stringify($page, null, 2)}
</pre>
```

Produces this

```
URL {
  href: 'http://localhost:5173/about',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  pathname: '/about',
  search: '',
  searchParams: URLSearchParams {},
  hash: ''
}
```

See this SO [question](https://stackoverflow.com/questions/71379031/how-do-get-query-string-parameter-in-sveltekit) for more info (and maybe a better way--see last answer)

## roger