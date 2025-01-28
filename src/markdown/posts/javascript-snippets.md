---
title: JavaScript snippets, nuggets, and helpers
description: A collection of various JavaScript routines, links, and other resources for remembering what lurks in its nooks and crannies.
tags: ['javascript']
date_added: 2024-05-01
date_updated: 2024-05-01
date_published: 
pinned: false
---

### Get ISO date from today's date

```js
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-CA");
}
```