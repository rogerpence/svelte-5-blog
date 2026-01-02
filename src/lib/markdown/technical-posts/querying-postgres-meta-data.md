---
title: Querying Postgre meta data
description: Querying Postgre meta data
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - postgres
---
```
SELECT * FROM pg_tables WHERE tablename = 'family'
```