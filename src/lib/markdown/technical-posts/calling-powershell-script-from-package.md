---
title: Calling a PowerShell script from a package.json script
description: Calling a PowerShell script from a package.json script
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
`pwsh` calls PowerShell 7. The double ampersand separates commands.

```
"scripts": {
    "dev": "pwsh -File ./cli/hello-world.ps1 && vite dev",
    ...
```