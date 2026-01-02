---
title: Notes from early efforts are multi-locales with Sveltekit
description: Notes from early efforts are multi-locales with Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - asna-com
  - depcreated
---
See the 'regional-routing' project for a prototype.

[Specify language with optional route](https://learn.svelte.dev/tutorial/optional-params)

[Change lang attribute in HTML](https://youtu.be/Kzrz7GZ9pIg?t=633](https://youtu.be/Kzrz7GZ9pIg?t=639)

```
<script>
    import {page} from'$app/stores'

	const {lang = 'en'} from $page.params
</script>
```

The `~/+page.svelte` file is the English (en) home page.

Other regions' home pages are in `routes/xx` where 'xx' is the two-character region code. The "regions" identified by folders under `routes` define the language regions available.

The `routes/en` route should redirect back to the root with a `page.ts` file like this:

```
import { redirect } from '@sveltejs/kit';
throw redirect(302, "/")
```

```
.
└── src
    ├── lib
    │   └── components
    ├── routes
    │   ├── [...lang]
    │   │   ├── posts
    │   │   │   └── [slug]
    │   │   ├── en
    │   │   └── es
    │   └── site-content
    │       └── posts
    │           ├── helloworld.en.svelte
    │           └── helloworld.es.svelte
    ├── app.d.ts
    ├── app.html
    ├── hooks.server.ts
    └── hooks.ts
```

Input to tree builder

```
src
  lib
    components
  routes
    [...lang]
      posts
        [slug]
      en
      es
    site-content
      posts
        helloworld.en.svelte
        helloworld.es.svelte
  app.d.ts
  app.html
  hooks.server.ts
  hooks.ts
```

### Showing content

The `~/routines/[...lang]` is the top-level route. It has children directories that define the site's content routes. This example shows only a `posts` route with a child `[slug]`route, but there could be others such as `posts`, `kb`, `pipeline`, `resources`, `services`, `support`, `company`, etc. Each one of these folders needs a child [slug] folder with the `+page.svelte` and `+page.ts` files.

A downside to this hack is that there can't be a `~/products` page or any of the other "routes" you defined under the `[:lang]` folder (ie, to get to a `products` page you have to use the route `products/products`). This is a minor consideration for persisting existing routes. (ie, we can't persist the `/products` route to get a top-level page about products.

### Changing the HTML language code

The `~/app.html` html tag is

```
<html lang="%lang%">
```

the `~/hooks.server.ts` file captures the two-character region code from the URL and replaces `%lang` with the current region code. I'm not sure what to do with it yet, but this hook also puts this value in

```
event.locals.lang
```