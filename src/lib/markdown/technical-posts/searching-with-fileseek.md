---
title: FileSeek configuration tips
description: FileSeek configuration tips
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
  - utilities
---
![[Pasted image 20231010223558.png]]
Separate folders with the pipe character. Do not include an spaces between folder names the pipe character.

![[Pasted image 20231010231811.png]]
Do not have "Process file contents use File Handlers (slower)" selected. This setting returns spurious results! (many false positives)

![[Pasted image 20231010223745.png]]

"Treat all Exclude Path filters as wildcards" and "Treat all Include Path filters are wildcards" should both be checked.