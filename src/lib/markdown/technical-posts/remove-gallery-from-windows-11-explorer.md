---
title: Remove the Gallery from Windows 11 Explorer
description: Remove the Gallery from Windows 11 Explorer
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - windows
---
Video
https://www.youtube.com/watch?v=YKxZ3Ru_wws

Corresponding blog post
https://pureinfotech.com/remove-gallery-file-explorer-windows-11/

These steps add this key:

```
[HKEY_CURRENT_USER\Software\Classes\CLSID\{e88865ea-0e1c-4e20-9aa6-edcd0212c87c}]
"System.IsPinnedToNamespaceTree"=dword:00000000
```

![[remove-gallery-from-explorer.reg]]