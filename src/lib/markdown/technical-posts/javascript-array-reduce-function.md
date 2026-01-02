---
title: JavaScript map function
description: JavaScript map function
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
Using `Array.reduce()` to transform a JavaScript array.

```
// const sorted = content.reduce((acc: FolderAccumulator, item: MarkdownResult<RPBlogPost>) => {
    const folder: string = item.folder;
    if (!acc[folder]) {
        acc[folder] = [];
    }
    acc[folder].push(
        {
            title: item.data.frontMatter.title,
            description: item.data.frontMatter.description,
            date_created: 2025-01-05 12:00
date_updated: 2025-01-05 12:00
date_published:
tags: item.data.frontMatter.tags,
            date_added: item.data.frontMatter.date_added,
            date_updated: item.data.frontMatter.date_updated,
            date_published: item.data.frontMatter.date_published,
            pinned: item.data.frontMatter.pinned,
            content: item.data.content,
            fullPath: item.fullPath,
            slug: item.slug,
            folder: item.folder
        }
    );
    return acc;  // Add missing return statement
}, {} as FolderAccumulator);
```