---
title: Comparing dataview query to a dataviewjs query
description: Comparing dataview query to a dataviewjs query
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-09-30T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - obsidian
---
`dataview` queries are much simpler than `dataviewjs` queries, but `dataviewjs` queries are much more powerful.

These two queries produce exactly the same results.

### dataview version

```_dataview
TABLE WITHOUT ID (tag + "(" + length(rows.file.link) + ")") AS Tags, sort(rows.file.link) AS Files
FROM ""
WHERE file.tags
FLATTEN file.tags AS tag
GROUP BY tag
SORT tag
```

### dataviewjs version

```_dataviewjs
// Retrieve all pages
let pages = dv.pages();

// Create an array to store the tags and corresponding files
let tagsMap = new Map();

// Flatten the tags and group them
pages.forEach(page => {
    if (page.file.tags) {
        page.file.tags.forEach(tag => {
            if (!tagsMap.has(tag)) {
                tagsMap.set(tag, []);
            }
            tagsMap.get(tag).push(page.file.link);
        });
    }
});

dv.paragraph(`Total Documents: ${pages.length}`);

// Sort the tags alphabetically
let sortedTags = Array.from(tagsMap.keys()).sort((a, b) => a.localeCompare(b));

// Sort files by name for each tag and create the table
dv.table(
    ["Tags", "Files"],
    sortedTags.map(tag => [
        `${tag} (${tagsMap.get(tag).length})`, // Tag with count
        tagsMap.get(tag)
            .sort((a, b) => a.path.localeCompare(b.path)) // Sort files by filename
    ])
);
```

This isn't an exact comparison but it's close. This shows all documents edited today

```_dataview
TABLE
    file.folder,
    file.description,
    dateformat(file.mtime, "yyyy-MM-dd") as "Edited"

SORT file.name asc

WHERE dateformat(file.mtime, "yyyy-MM-dd") = dateformat(date(now), "yyyy-MM-dd")
```

```_dataviewjs
const today = new Date(now()).toISOString().substring(0,10)

let pages = dv.pages()
	.where(p => p.file.mtime.toISODate() == today)
	.sort(p=> p.file.name)

dv.paragraph(`**Documents Found:** ${pages.length}`);

dv.table(
    ["File Name", "Description", "Edited"],
    pages.map(page => [
        page.file.link, // Link to the file
        page.description, // Display the. title property
        page.file.mtime.toISODate()
    ])
);
```