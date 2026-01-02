---
title: A Vite search-and-replace plugin
description: A Vite search-and-replace plugin
date_updated: 2025-12-17
date_created: 2025-02-02T00:00:00.000Z
date_published:
pinned: false
tags:
  - vite
---
Two options for a Vite plugin that performs a simple search and replace during render time:

````javascript
/**
 * Vite plugin for search and replace during build/dev
 * @param {Object} options - Configuration options
 * @param {Array<{search: string|RegExp, replace: string}>} options.replacements - Array of search/replace pairs
 * @param {Array<string>} options.include - File patterns to include (default: all)
 * @param {Array<string>} options.exclude - File patterns to exclude
 * @returns {import('vite').Plugin}
 */
export function searchReplacePlugin(options = {}) {
	const {
		replacements = [],
		include = [/\.(svelte|js|ts|html|css)$/],
		exclude = [/node_modules/]
	} = options;

	return {
		name: 'vite-plugin-search-replace',
		
		enforce: 'pre', // Run before other plugins
		
		transform(code, id) {
			// Check if file should be processed
			const shouldInclude = include.some(pattern => 
				pattern instanceof RegExp ? pattern.test(id) : id.includes(pattern)
			);
			
			const shouldExclude = exclude.some(pattern =>
				pattern instanceof RegExp ? pattern.test(id) : id.includes(pattern)
			);
			
			if (!shouldInclude || shouldExclude) {
				return null;
			}
			
			// Perform replacements
			let transformedCode = code;
			let hasChanges = false;
			
			for (const { search, replace } of replacements) {
				const originalCode = transformedCode;
				
				if (search instanceof RegExp) {
					transformedCode = transformedCode.replace(search, replace);
				} else {
					transformedCode = transformedCode.replaceAll(search, replace);
				}
				
				if (originalCode !== transformedCode) {
					hasChanges = true;
				}
			}
			
			// Return transformed code with source map
			if (hasChanges) {
				return {
					code: transformedCode,
					map: null // Set to null for simplicity, or generate proper source map
				};
			}
			
			return null;
		}
	};
}
```

## Usage in `vite.config.js`:

```javascript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { searchReplacePlugin } from './vite-plugins/search-replace.js';

export default defineConfig({
	plugins: [
		searchReplacePlugin({
			replacements: [
				{
					search: 'IBM&nbsp;i',
					replace: 'IBM i'
				},
				{
					search: /ASNA's/g,
					replace: 'ASNA\'s'
				},
				{
					search: '{{YEAR}}',
					replace: new Date().getFullYear().toString()
				}
			],
			include: [/\.svelte$/, /\.js$/],
			exclude: [/node_modules/, /\.config\./]
		}),
		sveltekit()
	]
});
````

## Alternative: Simpler version with just string replacements:

````javascript
export function simpleSearchReplace(replacements) {
	return {
		name: 'simple-search-replace',
		
		transform(code, id) {
			// Only process Svelte files
			if (!id.endsWith('.svelte')) {
				return null;
			}
			
			let result = code;
			
			// Apply all replacements
			Object.entries(replacements).forEach(([search, replace]) => {
				result = result.replaceAll(search, replace);
			});
			
			// Only return if changes were made
			if (result !== code) {
				return { code: result, map: null };
			}
			
			return null;
		}
	};
}
```

## Simple usage:

```javascript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { simpleSearchReplace } from './vite-plugins/search-replace-simple.js';

export default defineConfig({
	plugins: [
		simpleSearchReplace({
			'IBM&nbsp;i': 'IBM i',
			'{{COMPANY}}': 'ASNA',
			'{{YEAR}}': new Date().getFullYear().toString()
		}),
		sveltekit()
	]
});
```

## Features:

- **Build-time replacement**: Runs during both dev and build
- **File filtering**: Can include/exclude specific file types
- **RegExp support**: Supports both string and regex patterns
- **No runtime overhead**: Replacements happen at build time
- **Source map compatible**: Can be extended to maintain source maps

The plugin runs during the `transform` phase, which means it processes files as they're being bundled, making it efficient for both development and production builds.