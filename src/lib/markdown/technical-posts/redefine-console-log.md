---
title: redefine console.log
description: redefine console.log
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - typescript
---
```
    const originalLog = console.log;

    console.log = function() {
      const stack = new Error().stack;
      const callerLine = stack?.split('\n')[2];
      //const parts = callerLine?.match(/at (.*) \((.*):(\d+):(\d+)\)/);
      const parts = extractInfo(callerLine)

      //let prefix = '';
      let prefix = `${parts.filename}:${parts.position}\n`;

      originalLog.apply(console, [prefix, ...arguments]);
    };

  }
```