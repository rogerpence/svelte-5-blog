---
title: CSS Flex demystified
description: CSS Flex demystified
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css/flex
---
Okay, let's demystify the `flex` shorthand property in CSS. It's a powerful way to control how flex items (the children inside a flex container) size themselves.

**The Core Idea:**

The `flex` property is a **shorthand** for three individual properties that control the flexibility of a flex item:

1.  **`flex-grow`**: How much should the item grow if there's extra space?
2.  **`flex-shrink`**: How much should the item shrink if there isn't enough space?
3.  **`flex-basis`**: What's the item's ideal starting size _before_ growing or shrinking?

**Syntax:**

```css
.flex-item {
    /* flex: <flex-grow> <flex-shrink> <flex-basis>; */
    flex: 0 1 auto; /* This is the default value */
}
```

Let's break down the components:


**1. `flex-grow` (The first value)**

-   **What it does:** Dictates the proportion of _available extra space_ in the flex container that this item should take up.
-   **Value:** A unitless, non-negative number (e.g., `0`, `1`, `2`).
-   **Default:** `0` (meaning the item won't grow by default).
-   **How it works:** If you have extra space in the container, it's distributed among items with `flex-grow` greater than `0`.
    -   If one item has `flex-grow: 1` and others have `flex-grow: 0`, that one item gets _all_ the extra space.
    -   If Item A has `flex-grow: 1` and Item B has `flex-grow: 2`, Item B will get twice as much of the extra space as Item A.


**2. `flex-shrink` (The second value)**

-   **What it does:** Dictates the proportion of _overflow_ space that should be removed from this item if the items collectively are too big for the container.
-   **Value:** A unitless, non-negative number (e.g., `0`, `1`, `2`).
-   **Default:** `1` (meaning the item _will_ shrink proportionally by default if needed).
-   **How it works:** If items need to shrink, those with a higher `flex-shrink` value will shrink more relative to others.
    -   `flex-shrink: 0` means the item will _not_ shrink below its `flex-basis` size. It becomes inflexible in terms of shrinking.
    -   If Item A has `flex-shrink: 1` and Item B has `flex-shrink: 2`, Item B will shrink twice as much as Item A when space is tight (relative to their `flex-basis`).


**3. `flex-basis` (The third value)**

-   **What it does:** Defines the "ideal" or "hypothetical" starting size of the item _before_ any growing (`flex-grow`) or shrinking (`flex-shrink`) calculations are applied.
-   **Value:** Can be a length (`px`, `em`, `%`, etc.) or the keyword `auto` or `content`.
-   **Default:** `auto` (meaning "look at my `width` or `height` property first, otherwise size me based on my content").
-   **How it works:** This is the size the browser _tries_ to give the item. Then, it checks if there's extra space (apply `flex-grow`) or not enough space (apply `flex-shrink`) compared to the sum of all `flex-basis` values.
    -   If set to `0` (or `0%`), the item's content size is ignored for the initial space calculation, and space distribution relies entirely on `flex-grow` factors.


**Common Shorthand Values:**

You'll often see single-value keywords used with `flex`:

-   `flex: initial;`
    -   Equivalent to: `flex: 0 1 auto;` (The default)
    -   Doesn't grow, shrinks if needed, basis is determined automatically. Item sizes itself based on its `width`/`height` or content.
-   `flex: auto;`
    -   Equivalent to: `flex: 1 1 auto;`
    -   Grows to fill space, shrinks if needed, basis is determined automatically. It's flexible both ways, respecting its initial size.
-   `flex: none;`
    -   Equivalent to: `flex: 0 0 auto;`
    -   Doesn't grow, doesn't shrink. Item is inflexible, sticking to its `auto` basis (usually its content or explicit width/height).
-   `flex: <number>;` (e.g., `flex: 1;`, `flex: 2;`)
    -   Equivalent to: `flex: <number> 1 0%;`
    -   **This is very common!** It means the item grows proportionally (`<number>`), shrinks normally (`1`), and has a `flex-basis` of `0`. The `0` basis is key – it makes items share space relative _only_ to their `flex-grow` factor, ignoring their initial content size. This is great for creating equal-width columns (`flex: 1` on all items).


**Example: Equal Width Columns**

```html
<div class="container">
    <div class="item">Item 1</div>
    <div class="item">Item 2 has more content</div>
    <div class="item">Item 3</div>
</div>
```

```css
.container {
    display: flex;
    border: 1px solid black;
}

.item {
    flex: 1; /* This is flex: 1 1 0%; */
    border: 1px solid red;
    padding: 10px;
}
```

**Result:** All three items will have equal width, regardless of their content. Why?

1.  `flex-basis: 0%`: Initially, each item is considered to have zero width.
2.  `flex-grow: 1`: All the container's space is considered "extra space". Since all items have `flex-grow: 1`, they each get an equal share (1/3) of that total space.
3.  `flex-shrink: 1`: If the window gets too small, they will shrink proportionally (though this often doesn't happen if basis is 0 unless you have min-widths).


**Key Takeaway:**

The `flex` shorthand is your primary tool for controlling how flex items size themselves within their container, balancing their ideal size (`flex-basis`) with their willingness to grow (`flex-grow`) or shrink (`flex-shrink`) based on available space. Understanding the three components and the common keyword shortcuts (`initial`, `auto`, `none`, `1`) will get you very far!