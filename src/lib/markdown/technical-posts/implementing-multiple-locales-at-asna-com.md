---
title: How the multi-locale feature is implemented at ASNA.com
description: How he multi-locale feature is implemxented at ASNA.com
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - sveltekit
  - asna-com
---

```
import { redirect } from '@sveltejs/kit';
```

Just stashing these notes here for now:

Get locale from route in layout.server.js

```
export async function load({ route }) {
	console.log(route.id);
	return {
		locales: 'en'
	};
}
```

get local from +page.svelte or +layout.svelte

```
import { page } from '$app/stores';
const locale = $page.url.pathname.slice(1, 3);
```

All routes should specify a locale. A server hook ensures that the route '/' is redirected to `/en`

> The hard-coded `en` will later be changed to a app constant.

```
if (event.url.pathname == '/') {
	console.log('root requested');
	throw redirect(302, '/en');
}
```

`hooks.server.js`

Note that the server hook also sets the language for the page.

```
// State 1 - request received.
export const handle = async ({ event, resolve }) => {
	// Stage 2 - do something with incoming request.

	console.log(event.url.pathname);

	if (event.url.pathname == '/') {
		console.log('root requested');
		throw redirect(302, '/en');
	}

	// Stage 2
	const locale = event.url.pathname.slice(1, 3) || 'en';

	const response = await resolve(event, {
		// Swap out the %locale% value (that is present in ~/app.html)
		transformPageChunk: ({ html }) => html.replace('%locale%', locale)
	});

	// Stage 3
	return response;
};
```

`app.html`

The `app.html` file includes the following so that the `lang` value is swapped out to the current locale at runtime.

```html
<html lang="%locale%"></html>
```

Implementing multiple locales with Sveltekit is a bit of a challenge. The `routes` folder shows an example with a site for English and Spanish locals.

#### Locale-specific posts

> Pages versus posts -- pages are the grouped (mostly) static parts of the site grouped. Page groups includes products, services, etc and are presented on the main nav bar. Posts are the more dynamic parts of the site. Post groups are knowledge base, case studies, and newsletter. Access to these parts are from the main nav bar.  
> Todo: each of the post groups needs a paginated home page for that group.

Locale-specific roots are specified with the `+layout.svelte` and `+page.svelte` at the roots of `en` and `es`. These files are language-specific versions for their respective languages.

Directly under the locale folder (`en` or `es` in this case) is a `kb` folder with dynamic routes specified (via the `[slug]` folder). `kb` is the "Knowledge Base folder." There is no direct content in the `[slug]` folder. Rather, logic in the `+page.js` file tries to load the requested route from a markdown file in the `content-kb` folder.

```
│   ├── kb
    │   │   └── [slug]
    │   │       ├── +page.js
    │   │       └── +page.svelte
```

The logic for fetching a markdown file looks at the locale specified in the url. If the url starts with `en`, then a markdown file with the file named of the current slug + '.en.md' is displayed. If the url starts with any locale except `en`, then if the corresponding markdown file for that locale exists it is displayed, otherwise the English version of the markdown file is displayed. These markdown files are not server-

In addition to the `content-kb` folder, there would probably also be `content-nl` and a `content-cs` folders. These folder work just like the `content-kb` folder, providing access to newsletter and case study content respectively. Think of the `kb`, `nl`, and `cs` folders are providing access to posts for the site.

Other folders immediately off the locale root provide access to pages such as `products` or `services`. These pages are locale-specific Svelte components. (all pages should be server-side rendered). The full list of page sections (folders) are:

-   migration
-   products
-   services
-   support
-   company
-   privacy

The `+page.js` and `+page.js` files

```
.
└── routes
    ├── en
    │   ├── kb
    │   │   └── [slug]
    │   │       ├── +page.js
    │   │       └── +page.svelte
    │   ├── +layout.svelte
    │   └── +page.svelte
    └── en
        ├── kb
        │   └── [slug]
        │       ├── +page.js
        │       └── +page.svelte
        ├── +layout.svelte
        └── +page.svelte
```

```
routes
  en
    kb
      [slug]
        +page.js
        +page.svelte
    +layout.svelte
    +page.svelte
  en
    kb
      [slug]
        +page.js
        +page.svelte
    +layout.svelte
    +page.svelte
```

```
routes
  en
    kb
      [slug]
        +page.js
        +page.svelte
    +layout.svelte
    +page.svelte
  en
    kb
      [slug]
        +page.js
        +page.svelte
    +layout.svelte
    +page.svelte
```

new notes 2023-11-30

This is the code for any dynamic [slug] folder for fetching the markdown for a given slug. It gets the `folder` (ie, 'kb' or 'case-study') and the `locale` from the `route` value. Then it first tries to get the markdown for the locale specified. If that attempt fails, in then tries again with the default locale (which is 'en' in this example).

This provides locale-specific content for any dynamic route. If the content exists in the specific locale, that content is displayed. Otherwise, the content falls back to the content for the default locale.

This `+page.js` works for any folder and any locale.

`+page.js`

```
import { error } from '@sveltejs/kit';

const DEFAULT_LOCALE = 'en';

export const load = async ({ url, route, params }) => {
	// route = { id: '/en/kb/[slug]' }
	const folder = route.id.split('/')[2];
	const locale = route.id.slice(1, 3);

	try {
		const post = await import(`../../../markdown/${folder}/${params.slug}.${locale}.md`);
		return {
			content: post.default,
			meta: post.metadata
		};
	} catch {
		try {
			const post = await import(`../../../markdown/${folder}/${params.slug}.${DEFAULT_LOCALE}.md`);
			return {
				content: post.default,
				meta: post.metadata
			};
		} catch {
			throw error(404, `Could not find`);
		}
	}
};
```