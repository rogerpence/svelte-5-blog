---
title: mdsvex-markdown-sveltekit
description: Using mdsved with SvelteKit
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - svelte
---
Yes, MDsveX is still considered the best and most popular way to use Markdown with SvelteKit 2. It integrates seamlessly with SvelteKit's preprocessor system, allowing you to write Svelte components directly within your Markdown files and use front matter for metadata.

Here's why it remains a top choice:

*   **Svelte in Markdown:** MDsveX allows you to embed Svelte components directly into your Markdown, making it incredibly powerful for creating interactive content within static pages.
*   **Front Matter Support:** It has built-in support for YAML front matter, which is essential for defining metadata like title, date, author, and more for your Markdown pages.
*   **Syntax Highlighting:** Integrates well with remark-prism or other syntax highlighting libraries to make code blocks look great.
*   **Extensibility:** Being built on top of [remark](https://remark.js.org/) and [rehype](https://rehype.js.org/), you can extend its functionality with a vast ecosystem of plugins for things like table of contents generation, image optimization, and more.
*   **Active Maintenance:** It's well-maintained and keeps up with SvelteKit's advancements.

While there might be other experimental or niche solutions, MDsveX is the most mature, feature-rich, and widely adopted choice for this specific use case.

If you're looking to set it up, you'll typically:

1.  Install `mdsvex` and `svelte-preprocess`.
2.  Configure `svelte.config.js` to include the MDsveX preprocessor.
3.  Create `.mdsvex` files in your `src/routes` directory.

Here's a quick example of a simple `svelte.config.js` setup for MDsveX:

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md', '.svx'], // Add .md and .svx extensions

    preprocess: [
        vitePreprocess(),
        mdsvex({
            extensions: ['.md', '.svx'],
            layout: {
                blog: './src/lib/layouts/blog-layout.svelte' // Example for a layout
            }
        })
    ],

    kit: {
        adapter: adapter()
    }
};

export default config;
```

And then an example `.md` file:

```markdown
title: My Awesome Blog Post
date: 2023-10-27
author: AI Assistant


This is a paragraph in my SvelteKit blog post.

<script>
    import MyComponent from '$lib/components/MyComponent.svelte';
</script>

<MyComponent />

Here's some more content.
```

Would you like me to generate a simple visual representation of how MDsveX processes a Markdown file into a SvelteKit page?