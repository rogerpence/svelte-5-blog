---
title: CSS Holy Grail - Una
description: CSS Holy Grail - Una
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
https://codepen.io/rogerpence/pen/vEBONzN

Sure, here's an explanation of what each line in the provided CSS file is doing:

```css
div.main-wrapper {
    display: grid;
    height: 100vh;
    grid-template: auto 1fr auto/auto 1fr auto;
}
```

-   `div.main-wrapper`: Targets a `div` element with the class `main-wrapper`.
-   `display: grid;`: Sets the display of the `div` to a CSS Grid layout.
-   `height: 100vh;`: Sets the height of the `div` to 100% of the viewport height.
-   `grid-template: auto 1fr auto/auto 1fr auto;`: Defines a grid with three rows and three columns. The rows are `auto` (height determined by content), `1fr` (remaining space), and `auto`. The columns are `auto`, `1fr`, and `auto`.

```css
header {
    background: lightpink;
    padding: 2rem;
    grid-column: 1/4;
}
```

-   `header`: Targets the `header` element.
-   `background: lightpink;`: Sets the background color to light pink.
-   `padding: 2rem;`: Adds padding of 2 rem units around the content.
-   `grid-column: 1/4;`: Spans the header across all three columns (from column 1 to 4).

```css
.left-sidebar {
    background: lightblue;
    grid-column: 1/2;
}
```

-   `left-sidebar`: Targets an element with the class `left-sidebar`.
-   `background: lightblue;`: Sets the background color to light blue.
-   `grid-column: 1/2;`: Places the element in the first column.

```css
main {
    background: coral;
    grid-column: 2/3;
}
```

-   `main`: Targets the `main` element.
-   `background: coral;`: Sets the background color to coral.
-   `grid-column: 2/3;`: Places the element in the second column.

```css
.right-sidebar {
    background: yellow;
    grid-column: 3/4;
}
```

-   `right-sidebar`: Targets an element with the class `right-sidebar`.
-   `background: yellow;`: Sets the background color to yellow.
-   `grid-column: 3/4;`: Places the element in the third column.

```css
footer {
    background: wheat;
    padding: 2rem;
    text-align: center;
    grid-column: 1/4;
}
```

-   `footer`: Targets the `footer` element.
-   `background: wheat;`: Sets the background color to wheat.
-   `padding: 2rem;`: Adds padding of 2 rem units around the content.
-   `text-align: center;`: Centers the text inside the footer.
-   `grid-column: 1/4;`: Spans the footer across all three columns (from column 1 to 4).

```css
body {
    font-family: system-ui, sans-serif;
}
```

-   `body`: Targets the `body` element.
-   `font-family: system-ui, sans-serif;`: Sets the font family to `system-ui` with a fallback to `sans-serif`.

```css
.left-sidebar,
.right-sidebar {
    padding: 1rem;
}
```

-   `left-sidebar, .right-sidebar`: Targets both `.left-sidebar` and `.right-sidebar` elements.
-   `padding: 1rem;`: Adds padding of 1 rem unit around the content of both sidebars.