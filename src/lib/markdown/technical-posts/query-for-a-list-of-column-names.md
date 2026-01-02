---
title: query for a list of column names
description: query for a list of column names
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
---
Adjust this query as needed:

```
SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
FROM information_schema.columns
WHERE table_name   = 'family'
  AND table_schema = 'public'  -- Adjust schema if needed
  AND column_name <> 'id'
```

Results (a single, comma-delimited string)

```
created_at, name, description, visual_studio_version, availability_id, group_id, sort_order, download_page_section_heading, download_page_order, release_date
```