---
title: dataview
description: dataview
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - obsidian
---
```js
dataview

TABLE WITHOUT ID (tag + "(" + length(rows.file.link) + ")") AS Tags,
SORT (rows.file.link) AS Files
FROM ""
WHERE file.tags
FLATTEN file.tags AS tag
GROUP BY tag
SORT length(rows.file.link) DESC
```