---
title: Delete OneDrive
description: Delete OneDrive
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
---
I unlinked OneDrive and after that, I didn't have a Desktop folder. It was still at:

```
c:\users\thumb\onedrive\desktop
```

to fix:

-   copy the OneDrive\Desktop folder just in case
-   create a c:\users\thumb\desktop folder
-   Go to this key

```
  HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders
```

-   and change the `Desktop` folder