---
title: Animating the dialog element
description: Animating the dialog element
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - design
  - css
---
I got this code from a comment on this [Kevin Power video](https://www.youtube.com/watch?v=Vzj3jSUbMtI).
[Here it is in action](https://codepen.io/rogerpence/pen/mdQPmKp)

```
.Dialog {
  max-width: 90%;
  width: 350px;
  background: var(--color-fff);
  color: var(--color-000);
  padding: 20px;
  border-radius: 10px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  transition: opacity 0.4s cubic-bezier(0.4, 1.6, 0.4, 0.8),
    scale 0.4s cubic-bezier(0.4, 1.6, 0.4, 0.8), overlay 0.4s allow-discrete,
    display 0.4s allow-discrete;
  opacity: 0;
  scale: 0;
  &::backdrop {
    transition: display 0.4s allow-discrete, overlay 0.4s allow-discrete,
      background-color 0.4s;
  }
  &[open] {
    opacity: 1;
    scale: 1;
  }

  &[open]::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
}
@starting-style {
  .Dialog[open] {
    opacity: 0;
    scale: 0;
    &::backdrop {
      background-color: hsl(0 0 0 / 0);
    }
  }
}
```

See this MDN article [to learn about @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style). Note that[Can I Use says](https://caniuse.com/?search=%40starting-style) that there are some issues with this directive and Firefox.