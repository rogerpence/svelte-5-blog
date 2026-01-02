---
title: asna-wings
description: asna-wings
date_created: 2025-05-20T00:00:00.000Z
date_updated: 2025-12-31
date_published:
pinned: false
tags:
  - asna/wings
---

![[image-29.png]]


[The video here](https://nyc3.digitaloceanspaces.com/asna-assets/videos/quick-wings-demo.mp4) is an old, short Wings demo.
## Before Wings code

The code io `aspensvc` at 10.1.3.221 using DataGate 17.0 on port 5170

To run the before-Wings demo:

```
addlible rpmonger
call custinq
```

![[image-25.png|478x339]]

## Importing display files

The top two Wings templates create pages as WebForms. The third, with the ASNA "A", create pages as Razor pages.

![[image-28.png|393x207]]

Be sure to have "Use Wildcards" disabled, otherwise custdspf_o is also imported and it doesn't have the IndAra keyword included.

![[image-27.png|376x349]]
## Sign-on info

The after-Wings code is in the `rpmonger_w` library.

`rpmonger_w` is `rpmonger` with its `custinq` program compiled to reference the handler: 

![[image-26.png|567x92]]

![[image-23.png|474x297]]