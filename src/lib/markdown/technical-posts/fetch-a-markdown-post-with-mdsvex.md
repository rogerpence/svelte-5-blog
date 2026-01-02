---
title: Using Mdsvex to transform markdown
description: Using Mdsvex to transform markdown
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
The [mdsvex](https://www.npmjs.com/package/mdsvex) component is a markdown processor for Svelte components. Beyond processing the markdown, mdsvex also supports embedding Svelte components in the markdown.

```
pnpm i -D mdsvex
```

Configure mdsvex in the `svelte.config.js` file in the project root:

```
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		adapter: adapter()
	}
};

export default config;
```

Directory structure

```
.
└── src
    └── routes
        └── posts
            └── [slug]
                ├── +page.js
                └── +page.svelte
```

#### `+page.js`

`+page.js` receives the `params` object and that provides the selected post's slug. Vite's `import` method uses the relative path of the markdown file (which, thanks to mdsvex, is also a Svelte component)

```
export const prerender = true;

export const load = async ({ params }) => {
	const post = await
		import(`../../../../src/posts/${params.slug}.md`);

	return {
		content: post.default,
		meta: post.metadata
	};
};
```

#### `+page.svelte`

The `svelte.component` renders the dynamic component. `{data.content}` resolves to the markdown and the frontmatter properties are available through the `{data.meta}` object.

```
<script>
	import { page } from '$app/stores';

	export let data;
	// console.log(data);
</script>

<article>
	<header>
		<h1>{data.meta.title}</h1>
	</header>
	<!-- render the post -->
	<div>
		<svelte:component this={data.content} />
	</div>
</article>
```