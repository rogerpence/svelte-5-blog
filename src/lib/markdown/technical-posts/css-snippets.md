---
title: Mysterious CSS article
description: Mysterious CSS article
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
The lobotomized owl: Add a top margin to every element that is preceded by another element. This avoid a spurious top margin on the first element.

```
.content-flow > * . * {
    margin-block-start: 2rem;
}
```

Center a page with a max-width.

```
.wrapper {
  max-width: 1080px;
  margin: 0 auto;
}
```

Outline all descendants

```
[debug] * {
	outline: 2px dashed hsl(320 100% 50%);
}
```

Default anchor tag for any classless anchor. Using :where gives this zero specificity (which anything downstream can override it). (You could also achieve lower specificity by putting the code in its own layer.)

```
:where(a:not([class])) {
	color: var(--text-color);
	text-decoration: underline;
	text-decoration-skip-ink: auto;
	text-underline-offset: .3rem;
	text-decoration-style: solid;
	text-decoration-color: var(--accent-color);
	text-decoration-thickness: 1px;
}

:where(a:not([class]):hover) {
	text-decoration-thickness: 4px;
	font-weight: 900;
}
```

See this video (at the position noted) for more on what's going on here.

https://youtu.be/ZuZizqDF4q8?t=2483

```
@property --myprop {
	syntax: "<integer>",
	initial-value: 0;
	inherits: true;
}

.bar-chart {
    --myprop: calc(var(--myval));
}
```

To find what element is causing horizontal overflow (or many other maladies)

```
* {
   outline: 1px solid #f00 !important;
}
```

Add zebra striping to a series of tags

```
	div.products:nth-child(odd) {
		background-color: lightblue;
	}
```

Would it be “safe” to add `transition-behavior: allow-discrete` and `interpolate-size: allow-keywords` to our CSS reset?

[Animate details/summary tags](https://www.youtube.com/watch?v=Vzj3jSUbMtI) -- not quite ready for use everywhere as of 30 October but worth keeping an eye on.

Center content

```
margin-inline: auto;
```