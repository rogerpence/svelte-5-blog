---
title: Remove a file from a Git repo
description: Remove a file from a Git repo
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - git
---
Remove a file from the Git repo. This is necessary when you later decide to ignore a given file.

```
git rm --cached file.txt
```

Show all ignored files:

```
git status --ignored
```