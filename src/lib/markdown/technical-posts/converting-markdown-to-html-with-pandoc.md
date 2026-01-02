---
title: converting markdown to HTML with pandoc
description: converting markdown to HTML with pandoc
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - markdown
  - utilities
---
This used to be a part of the downloads workflow but has since been replaced by a C# program.

#### Converting markdown document to HTML with Pandoc and include style

```powershell
 pandoc -s -f markdown -t html -o avr-setup.html avr-setup.md -c style.css  --metadata title="title here"
```