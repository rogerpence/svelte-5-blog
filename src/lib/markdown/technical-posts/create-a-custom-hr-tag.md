---
title: Create a custom HR tag
description: Create a custom HR tag
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
Okay, here's how you can style an `<hr>` tag to be centered horizontally in the viewport and have a width of 50% of the viewport width using CSS.

The key is to set the `width` using viewport width units (`vw`) and then use `margin: auto` on the left and right sides to center it.

**HTML:**

It's good practice to add a class to your `<hr>` tag so you can style it specifically without affecting other potential `<hr>` elements on your page.

```html
<p>Some content above the line.</p>

<hr class="centered-half" />

<p>Some content below the line.</p>
```

**CSS:**

Here are a couple of common ways to style the `hr` itself after setting the width and centering:

**Method 1: Using `height` and `background-color` (Recommended for solid lines)**

```css
hr.centered-half {
    width: 50vw; /* Set width to 50% of the viewport width */
    margin-left: auto; /* Auto margin pushes it from the left */
    margin-right: auto; /* Auto margin pushes it from the right */

    /* --- Optional Styling for Appearance --- */
    border: none; /* Remove the default 3D border */
    height: 1px; /* Define the thickness of the line */
    background-color: #ccc; /* Set the color of the line (e.g., light grey) */

    /* Optional: Add some vertical space */
    margin-top: 2em;
    margin-bottom: 2em;
}

/* You can combine the margin properties like this: */
hr.centered-half-shorthand {
    width: 50vw;
    margin: 2em auto; /* 2em top/bottom, auto left/right */

    /* --- Optional Styling --- */
    border: none;
    height: 1px;
    background-color: #333; /* Darker grey example */
}
```

**Method 2: Using `border-top`**

Sometimes, people prefer styling the `hr` using its top border.

```css
hr.centered-half-border {
    width: 50vw;
    margin: 2em auto; /* Center horizontally, add vertical margin */

    /* --- Styling using border --- */
    border: none; /* Remove default borders */
    border-top: 2px solid blue; /* Define line style using border-top */
    /* Change '2px', 'solid', 'blue' as needed */
}
```

**Explanation:**

1.  **`width: 50vw;`**: This sets the width of the `<hr>` element to be exactly 50% of the current viewport's width. `vw` stands for "viewport width".
2.  **`margin-left: auto;` and `margin-right: auto;` (or `margin: auto` horizontally)**: When a block-level element (like `<hr>`) has a defined width that is less than its container's width, setting the left and right margins to `auto` tells the browser to distribute the remaining horizontal space equally on both sides, effectively centering the element.
3.  **`border: none;`**: Browsers often apply a default `border` (usually `inset`) to `<hr>` tags to give them a 3D look. Setting `border: none;` removes this, allowing you to define your own appearance cleanly.
4.  **`height: 1px;` and `background-color: #ccc;`**: (Method 1) After removing the border, the `hr` might become invisible. This gives it a specific height (thickness) and a solid color.
5.  **`border-top: ...;`**: (Method 2) This achieves a similar visual result by applying a border only to the top edge of the (now borderless) `hr` element.
6.  **`margin-top` / `margin-bottom` (or vertical value in `margin` shorthand)**: These are optional but usually desired to add some spacing above and below the rule.

Choose the CSS method you prefer and apply the class (`centered-half`, `centered-half-shorthand`, or `centered-half-border`) to your `<hr>` tag in the HTML.