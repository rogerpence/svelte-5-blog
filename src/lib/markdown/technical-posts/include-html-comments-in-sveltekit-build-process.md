---
title: Include HTML comments in Sveltekit build process
description: Include HTML comments in Sveltekit build process
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
By default, SvelteKit's build processes strips the HTML from SSG pages. This is generally what you want. However, I use a Sveltkit project to generate eblasts. The build process process HTML we pasted into Constant Contact and it works great.
Today, though, I ran into a reason to need persisted HTML comments in the built HTML. I wanted to include some HTML that should be included only in emails rendered to the Windows version of Outlook. For example, I needed to include this special-case comment:

```
<!--[if (gte mso 9)|(IE)]><br><![endif]-->
```

to include a `br` tag to add whitespace for Outlook. Alas, the default build process stripped that out.
After a little AI and Googling, I arrived at these settings to include HTML comments in Sveltekit's build process:
`vite.config.js`
The `esbuild` directive tells Vite to include comments.

```
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	esbuild: {
		legalComments: 'inline'
	}
});
```

`svelte.config.js`
The `compilerOptions` and `preserveComments` directives work with the Vite directive above to cause HTML includes to be included.

```
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components'
		},
	},
	// Include markup comments during the build process.
	compilerOptions: {
		preserveComments: true
	}
};

export default config;
```