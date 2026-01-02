---
title: Stop HTML background activity with CSS inert attribute
description: Stop HTML background activity with CSS inert attribute
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
You can do this by toggling the `inert` attribute, but that requires JavaScript. This little chunk of JavaScript is perfect for the job.

```
body:has(dialog[open]) {
    overflow: hidden;
}
```