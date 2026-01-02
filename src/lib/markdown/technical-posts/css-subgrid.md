---
title: CSS subgrid
description: CSS subgrid
date_created: 2025-08-05T00:00:00.000Z
date_updated: 2025-12-17
date_published:
pinned: false
tags:
  - css/subgrid
---
CSS Subgrid is a powerful feature that solves a whole class of layout problems that were previously very difficult to handle with pure CSS.

### The Analogy: Lined Paper

Imagine you have a sheet of lined paper. This is your **parent grid**. The horizontal lines are your `grid-template-rows`.

*   **Before Subgrid (Nested Grids):** You place several smaller, unlined sticky notes onto the paper. Each sticky note is a nested grid (`.column`). You can write on two lines within each sticky note, but the lines you draw yourself on one note will *not* line up with the lines on the note next to it. This is what happened with your first solution—each column created its own independent rows.

*   **With Subgrid:** You take transparent overlays (your `.column` elements) and place them on the lined paper. The `subgrid` keyword essentially tells the overlay: "Don't create your own lines. Use the lines from the paper underneath." Now, when you write on the first line of any overlay, it perfectly aligns with the first line on all other overlays, because they are all sharing the same master set of lines from the parent paper.


### The Core Concept: Borrowing Tracks

A normal nested grid creates its own, independent set of tracks (rows and columns) that have no relationship to the parent grid's tracks.

A **subgrid** is a grid container that, instead of creating its own tracks, **borrows the tracks from its direct parent grid**.

This means that items within the subgrid can be aligned to other items in *sibling* subgrids, because they are all ultimately being aligned on the same master grid defined by their common parent.


### Breaking Down Your Solution Step-by-Step

Let's look at the key pieces of CSS from the solution and analyze what each one does.

**1. The Parent Grid: `.column-wrapper`**

```css
.column-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: auto auto; /* The "Master Blueprint" for rows */
}
```

*   `display: grid;`: This establishes `.column-wrapper` as the master grid container.
*   `grid-template-rows: auto auto;`: This is the most critical declaration on the parent.
    *   It defines two explicit horizontal tracks (rows) for the entire grid.
    *   The `auto` keyword is crucial. It tells the browser: "For this row, find the tallest piece of content among *all* the items in this row (across all columns), and make the row exactly that tall."
    *   So, the first `auto` creates a row tall enough for your `Win 11 and windows 10...` content. The second `auto` creates a row tall enough for the tallest `.requirements` content.

**2. The Child Subgrid: `.column`**

```css
.column {
    display: grid;          /* Required to become a subgrid */
    grid-template-rows: subgrid; /* The magic keyword */
    grid-row: span 2;         /* Tells the column to occupy the parent's tracks */
}
```

*   `display: grid;`: A container *must* be a grid itself before it can be a subgrid.
*   `grid-template-rows: subgrid;`: This is the command that makes it all work. It tells `.column`:
    *   "Forget about creating your own rows."
    *   "Look at my parent (`.column-wrapper`)."
    *   "Inherit and use the row tracks that the parent has defined (`auto auto`)."
*   `grid-row: span 2;`: This is an essential supporting piece. The `.column` element itself is an item placed on the parent grid. We need to tell it to occupy the space of *both* rows that the parent has defined. If we omitted this, the `.column` would only take up the first row by default, and its children (`.platform`, `.requirements`) wouldn't have a second row to flow into.

Now, the two direct children of `.column` (`.platform` and `.requirements`) are placed into the two subgridded rows, which are perfectly aligned with the rows of all the other `.column` elements.

### Key Benefits Summarized

1.  **True Alignment:** It solves the core problem of aligning nested items across different parent containers.
2.  **Maintained HTML Semantics:** You don't have to break your logical HTML structure (keeping platform and requirements together in a column) just to achieve a certain layout.
3.  **Consistent Gapping:** If you define a `gap` on the parent grid, that gap is inherited by the subgrid, ensuring consistent spacing both between and *within* your columns.
4.  **Source of Truth:** The layout logic for the rows lives in one place (the parent grid), making the layout easier to understand and maintain.

### Browser Support and Fallbacks

Subgrid is supported in all major modern browsers (Chrome, Firefox, Safari, Edge). The main holdout was Chrome, which added support in late 2022. Its support is now widespread.

If you needed to support older browsers, you could use a feature query (`@supports`) to provide a simpler, non-aligned layout as a fallback:

```css
/* Fallback for older browsers */
.column {
    display: grid;
    grid-auto-rows: auto;
}

/* Modern browsers that support subgrid will get the perfect layout */
@supports (grid-template-rows: subgrid) {
  .column-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: auto auto;
  }
  
  .column {
    grid-template-rows: subgrid;
    grid-row: span 2;
  }
}
```

## Final solution

This CSS governs the product matrices  at: https://www.asna.com/en/support/product-requirements

![[image-40.png]]


```css
/* The Parent Wrapper - No changes here */
.column-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    grid-template-rows: auto auto; 
}

/* The Subgrid Column - No changes here */
.column {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 2;
    border-right: 1px solid white;
}

/* 
  The Top-Row Item - THIS IS THE CORRECTED RULE 
*/
.platform {
  /* This makes the .platform element a flex container, allowing it
     to control the alignment of its own children. */
  display: flex;

  /* This aligns the child items (the div with the text) to the
     bottom of the flex container (.platform). */
  align-items: flex-end;
}
```  
You described it perfectly as an "amalgam of solutions." It's a great showcase of how different CSS layout modules are designed to work together, each solving a specific part of a complex problem.

A quick recap of the layers:

1.  **The Foundation (CSS Grid):** We used `display: grid` on the main `.column-wrapper` to establish the overall multi-column structure and, most importantly, to define the two master rows whose height would be shared by everyone.

2.  **The Alignment Bridge (CSS Subgrid):** This was the magic ingredient. `grid-template-rows: subgrid` on each `.column` allowed them to "borrow" the master row tracks from the parent. This solved the primary problem of keeping the top and bottom rows perfectly aligned across all the columns.

3.  **The Finisher (Flexbox):** When we needed to align content *within* a grid cell without disturbing the cell's size, we turned `.platform` into a `display: flex` container. This allowed us to use `align-items: flex-end` to position the text at the bottom, while the `.platform` element itself continued to `stretch` and fill the full height of its grid row.

It's a perfect demonstration of the "right tool for the right job" principle:
*   **Grid** for the overall page structure.
*   **Subgrid** for aligning nested structures.
*   **Flexbox** for fine-tuning the alignment of items within a container.
