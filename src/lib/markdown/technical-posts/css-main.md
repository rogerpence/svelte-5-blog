---
title: Obsidian dataviewjs
description: Obsidian dataviewjs
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
  - dataviewjs
---
```dataview
TABLE
	durationformat((date(now) - file.mtime), "d") as "Days since edited",
    dateformat(file.mtime, "MM-dd") AS "Edited on"

FROM "css"
WHERE file.name != "CSS Main"
SORT date(now) - file.mtime
```