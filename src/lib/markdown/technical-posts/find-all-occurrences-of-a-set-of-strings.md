---
title: Find all occurrences of a set of strings within a string
description: Find all occurrences of a set of strings within a string
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
```
[...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index)

Example:

const sourceStr = 'I learned to play the Ukulele in Lebanon.';
const searchStr = 'le';
const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
console.log(indexes); // [2, 25, 27, 33]

```

[From this StackOverflow question.](https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript)