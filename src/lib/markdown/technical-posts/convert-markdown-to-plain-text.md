---
title: How to convert markdown to plain text using either Mdsvex or vanilla typescript
description: How to convert markdown to plain text using either Mdsvex or vanilla typescript
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - markdown
---
```ts
// ...existing code...

import { compile } from 'mdsvex';

// Option 1: Using mdsvex to compile, then strip HTML
async function markdownToPlainText(markdown: string): Promise<string> {
    const compiled = await compile(markdown);
    if (!compiled || !compiled.code) return '';
    
    // Strip HTML tags
    return compiled.code
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

// Option 2: Simple approach without HTML conversion - just strip markdown syntax
function stripMarkdown(markdown: string): string {
    return markdown
        .replace(/^#{1,6}\s+/gm, '') // Remove headers
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.+?)\*/g, '$1') // Remove italic
        .replace(/\_(.+?)\_/g, '$1') // Remove italic
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
        .replace(/`(.+?)`/g, '$1') // Remove inline code
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
        .trim();
}

// ...existing code...

x.forEach(({ dirent, markdownObject }) => {
    // Convert content to plain text
    const plainText = await markdownToPlainText(markdownObject.content);
    // OR
    const plainText = stripMarkdown(markdownObject.content);
    
    contentObjects.set(counter++, {
        title: markdownObject.frontMatter.title,
        description: markdownObject.frontMatter.description,
        date_updated: markdownObject.frontMatter.date_updated,
        pinned: markdownObject.frontMatter.pinned,
        folder: dirent.parentPath,
        filename: dirent.name,
        slug: getSlug(dirent),
        tags: markdownObject.frontMatter.tags,
        content: plainText // Use plain text version
    });
});
```