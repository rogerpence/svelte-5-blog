---
title: Vary holy grail aside and article columns widths (clamp and minmax)
description: Vary holy grail aside and article columns widths (clamp and minmax)
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
Yes, absolutely! You can use `minmax()` and `clamp()` to make the column widths of your aside and article elements responsive within your CSS grid. Here's how you can approach it, along with explanations:

**Understanding the Tools**

-   **`minmax(min, max)`:**
    -   Used within `grid-template-columns` or `grid-template-rows`.
    -   Sets the minimum and maximum size of a grid track (column or row).
    -   The track will try to be as large as it can, but won't go smaller than the `min` value or larger than the `max` value.
-   **`clamp(min, preferred, max)`:**
    -   Used with width, height, font-size and other size related properties
    -   Locks a value between `min` and `max`, using `preferred` when it is between those values.
    -   This allows you to define a size that responds to the available space, but has limits.

**Implementation**

Let's assume your initial grid structure looks something like this:

```html
<div class="grid-container">
    <header>Header</header>
    <aside>Aside</aside>
    <article>Article</article>
    <footer>Footer</footer>
</div>
```

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns, equal width */
    grid-template-rows: auto 1fr auto; /* Header, content area, footer */
    gap: 10px; /* Optional gap */
}

header,
footer {
    grid-column: 1 / -1; /* Spans from the first to the last column */
}

aside {
    /* set initial width for the aside */
}

article {
    /* set initial width for the article */
}
```

Here's how you can use `minmax()` and `clamp()` to make the aside and article columns responsive:

**Using `minmax()`**

```css
.grid-container {
    display: grid;
    grid-template-columns: minmax(200px, 20%) minmax(500px, 1fr); /* Responsive width of each column */
    grid-template-rows: auto 1fr auto;
    gap: 10px;
}

header,
footer {
    grid-column: 1 / -1;
}
```

-   **Explanation:**
    -   `grid-template-columns: minmax(200px, 20%) minmax(500px, 1fr);`
        -   **First column (`aside`):** `minmax(200px, 20%)` - The aside column will try to be `20%` of the container's width, but it will not shrink smaller than `200px`. This prevents it from becoming too small on very narrow screens.
        -   **Second column (`article`):** `minmax(500px, 1fr)` - The article column will try to fill remaining space of the container (`1fr`), but it will not shrink smaller than `500px` This ensure the content has enough space even on smaller screens.

**Using `clamp()`**

```css
.grid-container {
    display: grid;
    grid-template-columns: clamp(100px, 20%, 300px) clamp(400px, 80%, 1fr); /*Responsive width of each column */
    grid-template-rows: auto 1fr auto;
    gap: 10px;
}

header,
footer {
    grid-column: 1 / -1;
}
```

-   **Explanation:**
    -   `grid-template-columns: clamp(100px, 20%, 300px) clamp(400px, 80%, 1fr)`
        -   **First column (`aside`):** `clamp(100px, 20%, 300px)` - The aside column will aim to be `20%` of the container's width, but will not shrink smaller than `100px`, or grow larger than 300px.
        -   **Second column (`article`):** `clamp(400px, 80%, 1fr)` - The article column will aim to be `80%` of the container's width, but will not shrink smaller than `400px`, or grow larger than 1 fraction of available free space.

**Advantages of `minmax()` and `clamp()`:**

-   **Responsiveness:** Your layout adapts gracefully to different screen sizes.
-   **Content Preservation:** Avoids making columns too narrow, which can cause content to become unreadable.
-   **Flexibility:** You can fine-tune the minimum and maximum sizes to suit your design.
-   **No Media Queries:** Can drastically reduce the number of media queries you need.

**Choosing Between `minmax()` and `clamp()`:**

-   **`minmax()` is generally used inside grid context**, to set the sizing boundaries of columns and rows.
-   **`clamp()` is generally used when targeting a specific element size outside grid, and is a more generic tool** which provides more control, allowing you to lock a size between a minimum, preferred, and maximum.

**Important Considerations**

-   **Content Overflow:** Be mindful of how content might overflow the aside or article elements if their minimum sizes are too small.
-   **Testing:** Test your layout on various screen sizes to ensure it looks good and works well.
-   **User Experience:** Strive for a layout that's easy and comfortable for users to navigate on any device.

**Summary**

By using `minmax()` or `clamp()` in `grid-template-columns`, you can create a fluid and responsive grid layout where the aside and article columns adapt to different screen widths while maintaining readability. Experiment with different values to achieve the best balance for your design. Let me know if you have any other questions!