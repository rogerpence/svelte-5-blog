---
title: Using Pycco with Visual RPG
description: Using Pycco with Visual RPG
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - asna
  - python
---
## Pycco modifcation for commented code

By default, Pycco treats all comment lines as markdown text with which to document the code. This modifcation allows a `//-` comment to be passed through as a comment in the code. For example, this comment:

```
//- em.Attachments.Add("C:\Users\roger\Documents\dbnames.txt")
```

persists as a comment (with the dash removed) rather than be treated as a markdown text to push to the left of the code by Pycco.

![[snippet.svg]]

```
C:\Users\roger\AppData\Local\Programs\Python\Python310\Lib\site-packages\pycco\main.py
```

file path for change