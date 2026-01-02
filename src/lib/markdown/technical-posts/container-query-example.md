---
title: Container query example
description: Container query example
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
In this example, the color of the `div.content` changes from green to read when the width of the viewport goes to less than 600.

HTML

```
<div class="wrapper">
   <div class="content">
      <p>Hello, world</p>
      <p>Color changes from green to red when width shrinks.</p>
   </div>

</div>
```

CSS

```
div.wrapper {
    max-width: 1024px;
    container-type: inline-size;
    container-name: landing-page-wrapper;

    & div.content {
	    color: blue;

      @container content-wrapper (width < 601px) {
         color: red;
      }
	}
}
```