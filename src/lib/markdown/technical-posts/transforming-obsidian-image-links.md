---
title: Transforming Obsidian image links
description: This article shows how to transform Obsidian image links into HTML img tags at runtime in Sveltekit app.
date_updated: 2025-12-29
date_created: 2025-02-02
date_published:
pinned: false
tags:
  - sveltekit
  - obsidian
---

[[supabase-credentials#env files]]

 `unist-util-visit` is an NPM package is a small utility for **walking (visiting) nodes in a Unist syntax tree**. Unist is the common AST shape used across the Markdown/HTML 
  
  This code uses that package to to convert You can convert Obsidian’s `![[image.png|700]]` image syntx into a normal image node (with an optional width attribute) prepend a base URL.

### 1) Install
````powershell
npm i -D unist-util-visit
````

### 2) Add a remark plugin
````javascript
import { visit } from 'unist-util-visit';

const OBSIDIAN_IMAGE_RE = /!\[\[([^[\]|]+?)(?:\|(\d+))?\]\]/g;

function joinUrl(baseUrl, file) {
	const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
	// keep it simple; encode spaces etc.
	return base + encodeURIComponent(file.trim());
}

function defaultAltFromFilename(file) {
	// "image-32.png" -> "image-32"
	const name = file.replace(/^.*[\\/]/, '').replace(/\.[a-z0-9]+$/i, '');
	return name || '';
}

/**
 * Transforms Obsidian image embeds:
 *   ![[image-32.png|700]]
 * into mdast image nodes with optional width via hProperties.
 *
 * @param {{ baseUrl: string, alt?: 'filename' | 'empty' | ((file:string)=>string) }} options
 */
export default function remarkObsidianImages(options = {}) {
	const { baseUrl, alt = 'filename' } = options;
	if (!baseUrl) throw new Error('remarkObsidianImages: "baseUrl" is required');

	const getAlt =
		typeof alt === 'function'
			? alt
			: alt === 'empty'
				? () => ''
				: (file) => defaultAltFromFilename(file);

	return (tree) => {
		visit(tree, 'text', (node, index, parent) => {
			if (!parent || typeof index !== 'number') return;

			const value = node.value;
			if (!value || !value.includes('![[')) return;

			let match;
			let lastIndex = 0;
			const parts = [];

			OBSIDIAN_IMAGE_RE.lastIndex = 0;
			while ((match = OBSIDIAN_IMAGE_RE.exec(value)) !== null) {
				const [raw, file, widthStr] = match;
				const start = match.index;
				const end = start + raw.length;

				// leading text
				if (start > lastIndex) {
					parts.push({ type: 'text', value: value.slice(lastIndex, start) });
				}

				const width = widthStr ? Number(widthStr) : undefined;

				parts.push({
					type: 'image',
					url: joinUrl(baseUrl, file),
					alt: getAlt(file),
					title: null,
					data: width
						? {
								hProperties: { width }
							}
						: undefined
				});

				lastIndex = end;
			}

			// trailing text
			if (lastIndex < value.length) {
				parts.push({ type: 'text', value: value.slice(lastIndex) });
			}

			// Only replace if we actually matched something
			if (parts.length && parts.some((p) => p.type === 'image')) {
				parent.children.splice(index, 1, ...parts);
				// tell unist-util-visit to skip visiting the newly inserted nodes
				return [visit.SKIP, index];
			}
		});
	};
}
````

### 3) Wire it into `mdsvexOptions` in svelte.config.js
Add `remarkPlugins`:

````javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import remarkObsidianImages from './src/lib/markdown/remark-obsidian-images.js';

// ...existing code...

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	remarkPlugins: [
		[
			remarkObsidianImages,
			{
				baseUrl: 'https://asna.com/images/',
				alt: 'filename' // or: 'empty'
			}
		]
	],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			// ...existing code...
		}
	}
};

// ...existing code...
export default config;
````

### About `alt`
Since Obsidian’s syntax (as you’re using it) doesn’t include alt text, you have a few reasonable choices:
- `alt: 'filename'` (current default in the plugin): `"image-32"`
- `alt: 'empty'`: `alt=""` (treat as decorative)
- provide a function to compute alt, later (e.g., look up an image caption map)

After saving, **restart the dev server** (preprocessor changes won’t reliably HMR):

````powershell
npm run dev
````

If your Obsidian embeds sometimes include other formats (e.g. `![[path/to/image.png|700]]` or additional `|...` segments), paste a couple examples and I’ll widen the parser accordingly.