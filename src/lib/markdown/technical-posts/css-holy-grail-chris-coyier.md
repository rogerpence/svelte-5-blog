---
title: CSS Holy Grail - Chris Coyier
description: CSS Holy Grail - Chris Coyier
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
https://css-tricks.com/the-holy-grail-layout-with-css-grid/

### Global Styles

```css
* {
    box-sizing: border-box;
}
```

-   `box-sizing: border-box;`: This sets the `box-sizing` property to `border-box` for all elements, ensuring that padding and border are included in the element's total width and height.

### `body`

```css
body {
    background: #e4e4e4;
    padding: 5px;
    height: 100vh;
    margin: 0;
    font: 500 100% system-ui, sans-serif;
    text-transform: uppercase;
}
```

-   `background: #e4e4e4;`: Sets the background color of the body to a light gray.
-   `padding: 5px;`: Adds 5 pixels of padding inside the body.
-   `height: 100vh;`: Sets the height of the body to 100% of the viewport height.
-   `margin: 0;`: Removes the default margin around the body.
-   `font: 500 100% system-ui, sans-serif;`: Sets the font weight to 500, font size to 100%, and font family to `system-ui` and `sans-serif`.
-   `text-transform: uppercase;`: Transforms all text to uppercase.

### `.page-wrap`

```css
.page-wrap {
    background: white;
    height: calc(100vh - 10px);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.33);
    display: grid;
    grid-template-columns: minmax(10px, 1fr) minmax(10px, 3fr);
    grid-template-rows: min-content min-content 1fr min-content;
    gap: 1px;
}
```

-   `background: white;`: Sets the background color to white.
-   `height: calc(100vh - 10px);`: Sets the height to the full viewport height minus 10 pixels.
-   `box-shadow: 0 0 3px rgba(0, 0, 0, 0.33);`: Adds a subtle shadow around the element.
-   `display: grid;`: Defines the element as a grid container.
-   `grid-template-columns: minmax(10px, 1fr) minmax(10px, 3fr);`: Defines two columns with minimum widths of 10 pixels and maximum widths of 1 fraction unit and 3 fraction units respectively.
-   `grid-template-rows: min-content min-content 1fr min-content;`: Defines four rows with varying heights.
-   `gap: 1px;`: Sets a 1-pixel gap between grid items.

### `.page-wrap > *`

```css
.page-wrap > * {
    padding: 1rem;
    text-align: center;
}
```

-   `padding: 1rem;`: Adds 1 rem of padding inside each direct child of `.page-wrap`.
-   `text-align: center;`: Centers the text inside each direct child of `.page-wrap`.

### Media Query for Small Screens

```css
@media (max-width: 600px) {
    .page-wrap {
        grid-template-columns: 100%;
        grid-template-rows: auto;
    }
    .page-wrap > * {
        grid-column: 1/-1 !important;
        grid-row: auto !important;
    }
}
```

-   `@media (max-width: 600px) { ... }`: Applies the enclosed styles only when the viewport width is 600 pixels or less.
-   `.page-wrap { grid-template-columns: 100%; grid-template-rows: auto; }`: Changes the grid to a single column layout with automatic row heights.
-   `.page-wrap > * { grid-column: 1/-1 !important; grid-row: auto !important; }`: Forces each direct child of `.page-wrap` to span the entire width of the grid and have automatic row placement.

### `.page-header`

```css
.page-header {
    grid-column: 1/-1;
    background: #ffcdd2;
}
```

-   `grid-column: 1/-1;`: Makes the `.page-header` span from the first to the last column of the grid.
-   `background: #ffcdd2;`: Sets the background color to a light red.

### `.page-sidebar`

```css
.page-sidebar {
    grid-column: 1/2;
    grid-row: 2/4;
    background: #e1bee7;
}
```

-   `grid-column: 1/2;`: Places the `.page-sidebar` in the first column of the grid.
-   `grid-row: 2/4;`: Makes the `.page-sidebar` span from the second to the fourth row of the grid.
-   `background: #e1bee7;`: Sets the background color to a light purple.

### `.page-nav`

```css
.page-nav {
    grid-column: 2/3;
    background: #bbdefb;
}
```

-   `grid-column: 2/3;`: Places the `.page-nav` in the second column of the grid.
-   `background: #bbdefb;`: Sets the background color to a light blue.

### `.page-main`

```css
.page-main {
    grid-column: 2/3;
    background: #dcedc8;
}
```

-   `grid-column: 2/3;`: Places the `.page-main` in the second column of the grid.
-   `background: #dcedc8;`: Sets the background color to a light green.

### `.page-footer`

```css
.page-footer {
    grid-column: 1/-1;
    background: #ffecb3;
}
```

-   `grid-column: 1/-1;`: Makes the `.page-footer` span from the first to the last column of the grid.
-   `background: #ffecb3;`: Sets the background color to a light yellow.

### `details p`

```css
details p {
    text-transform: none;
    text-align: left;
}
```

-   `text-transform: none;`: Ensures that the text inside `p` elements within `details` elements is not transformed.
-   `text-align: left;`: Aligns the text inside `p` elements within `details` elements to the left.

Similar code found with 1 license type