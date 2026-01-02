---
title: How to page through a Json object
description: A 'Pager' class that fetches a page of objects from an array of Json objects
date_updated: 2025-12-18
date_created: 2025-02-02T00:00:00.000Z
date_published:
pinned: false
tags:
  - javascript
---
## A note on immutabilty

This pager doesn't explicitly protect against mutability of the input `arr` objects.
```ts
constructor(arr: T[], pageSize: number) {

	// Change this line
    this.arr = [...arr
    
    // to this to do a deep copy using structuredClone
    this.arr = structuredClone(arr);
```

For the Pager class, it's better to use the shallow copy:
1. Much better performance
2. Pagination typically doesn't modify data
3. If users need immutability, they should freeze their objects or use immutable data structures