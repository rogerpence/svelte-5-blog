---
title: bases notes
description: bases notes
date_created: '2025-10-01T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - bases
---
### With Bases

For **Bases**, the equivalent depends on the syntax you’re using:

- In SQL-like queries you can filter with `FROM this` to reference the current page.
    
- In JS mode, Bases exposes a `this` page context. Example:
    

`SELECT property FROM this`

or in JS:

`let page = this;  return page.properties.MyProperty;`