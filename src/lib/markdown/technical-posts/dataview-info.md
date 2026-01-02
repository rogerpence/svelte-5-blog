---
title: dataviewjs -- pages without a description
description: dataviewjs -- pages without a description
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-09-30T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - obsidian
---
file properties
https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/

### dataviewjs example

```
// Select all documents that do not have a 'description' property
let pagesWithoutTitle = dv.pages().where(
    p => p.file.tags.includes("#menu")
);

// Sort the pages by file name
pagesWithoutTitle = pagesWithoutTitle.sort(p => p.file.name ? p.file.name.toLowerCase() : "");

// Create a table with "File Name" and "Description"
dv.table(
    ["Description", "File Name", "Folder"],
    pagesWithoutTitle.map(page => [
        page.description, // Indicate that there is no title
        page.file.link, // Link to the file
        page.file.folder
    ])
);
```