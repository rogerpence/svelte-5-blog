---
title: example svelte.config.js
description: example svelte.config.js
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - sveltekit
---
```
 import adapter from '@sveltejs/adapter-auto';
//import adapter from '@sveltejs/adapter-vercel';

import { vitePreprocess } from '@sveltejs/kit/vite';

import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$cmdline: 'src/lib/cmd-line',
			$data: 'src/lib/data',
			$routes: 'src/routes'
		}
	}
};

export default config;
```