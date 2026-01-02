---
title: CSS center a response image with a caption
description: CSS center a response image with a caption
date_created: '2025-07-20T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
Center a response image  with a caption 


```
figure {
  inline-size: fit-content;
  margin-inline: auto;
}
figcaption {
  /* no size contribution for figcaption */
  contain: inline-size;
}
img {
  /* you can have max-width */
  max-width: 100%; 
}
```