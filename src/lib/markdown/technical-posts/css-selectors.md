---
title: CSS selectors
description: CSS selectors
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
### Next sibling

The **next-sibling combinator** (`+`) separates two selectors and matches the second element only if it *immediately* follows the first element, and both are children of the same parent [`element`](https://developer.mozilla.org/en-US/docs/Web/API/Element).

```css
/* Paragraphs that come immediately after any image */
img + p {
    font-weight: bold;
}
```

### Child combinator

The **child combinator** (`>`) is placed between two CSS selectors. It matches only those elements matched by the second selector that are the direct children of elements matched by the first.

```css
/* List items that are children of the "my-things" list */
ul.my-things > li {
    margin: 2em;
}
```

### Subsequent sibling combinator

The **subsequent-sibling combinator** (`~`, a tilde) separates two selectors and matches *all instances* of the second element that follow the first element (not necessarily immediately) and share the same parent element.
In the following example, the subsequent-sibling combinator (`~`) helps to select and style paragraphs that are both siblings of an image and appear after any image.

```
img ~ p {
  color: red;
}
```

### Descendant combinator

The **descendant combinator** — typically represented by a single space (" ") character — combines two selectors such that elements matched by the second selector are selected if they have an ancestor (parent, parent's parent, parent's parent's parent, etc.) element matching the first selector. Selectors that utilize a descendant combinator are called *descendant selectors*.

```
/* List items that are descendants of the "my-things" list */
ul.my-things li {
  margin: 2em;
}
```