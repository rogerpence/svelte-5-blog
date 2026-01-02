---
title: using-mdsvex-with-remote-function
description: Using Mdsvex with a SvelteKit remote function
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - svelte
---
```
import fs from 'fs';
import path from 'path';
import { compile } from 'mdsvex';
import matter from 'gray-matter';

export async function load({ params }) {
    const filePath = path.join(process.cwd(), 'content', 'technical-posts', `${params.slug}.md`);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter
    const { data: frontmatter, content } = matter(rawContent);
    
    // Compile markdown to Svelte component
    const compiled = await compile(content);
    
    return {
        frontmatter,
        content: compiled?.code || '',
        slug: params.slug
    };
}
```