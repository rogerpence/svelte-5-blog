---
title: Custom JavaScript console
description: Custom JavaScript console
date_created: '2025-07-14T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
```js
function customLog(...args) {
    const err = new Error();
    const stack = err.stack.split("\n");
    // The first line is 'Error', the second is the current function, so we take the third.
    let callerInfo = stack[2].trim();
    console.log(`[${callerInfo}]` + "\r\n -->", ...args);
}
```