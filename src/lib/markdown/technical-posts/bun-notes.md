---
title: Bun notes vs code debugging
description: Bun notes vs code debugging
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - bun
---
```
bun pm cache rm

# Remove node_modules
rm -r -force node_modules

# Reinstall with admin rights
bun install
```

```
rm -r -force node_modules
rm -force bun.lockb
bun install
```

launch.json for Bun

```
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Debug with Bun",
        "type": "bun",
        "request": "launch",
        "program": "${file}"
      }
    ]
  }
```