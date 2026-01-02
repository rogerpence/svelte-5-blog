---
title: Restore old context menu on Windows 11
description: Restore old context menu on Windows 11
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
---
### Restore old context menu on Windows 11

Put this is a text file with a .reg extension and double-click it.

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32]
@=""
```