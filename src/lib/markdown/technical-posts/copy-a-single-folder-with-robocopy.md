---
title: Recursively copy a single folder with RoboCopy
description: Recursively copy a single folder with RoboCopy
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
---
[RoboCopy help](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy)

```
robocopy c:\source d:\destination /E
```

```
/xd node_modules AppData dat site-packages .git Dropbox
```

```
/xf NTUSER.DAT* ntuser.ini *.gm2 *.gbp *.pst *.vhdx .dmp
```

| Flag    | Description                                                                                                                                                |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/E`    | Copy empty directories                                                                                                                                     |
| `/xd`   | Exclude directories                                                                                                                                        |
| `/xf`   | Exclude files                                                                                                                                              |
| `/v`    | Verbose console output                                                                                                                                     |
| `/mir`  | Mirror source folder to target folder. Ensures destination directory is an exact copy of the source directory. Could delete files in the target directory! |
| `/mt:n` | Use `n` threads when coping to increase performance. 64 seems like a good value.                                                                           |
| `/nfl`  | Surpress file listing to console while copying.                                                                                                            |