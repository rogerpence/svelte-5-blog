---
title: Show or hide an element based on landscape/portrait mode
description: Show or hide an element based on landscape/portrait mode
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - css
---
Okay, let's use container queries to achieve this. The key idea is to make the element _containing_ the table and the message a query container, and then use `@container` rules based on its `orientation` or `aspect-ratio`.

Here's how you can do it:

**1. HTML Structure**

You need a wrapper element around both your table (`div.comparo-table`) and the message you want to show. This wrapper will become the container.

```html
<!-- This div will be our query container -->
<div class="table-container">
    <!-- Your original table -->
    <div class="comparo-table">
        <!--  LOTS OF TABLE CONTENT HERE... -->
        <table>
            <thead>
                <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                    <th>Header 3</th>
                    <th>Header 4</th>
                    <th>Header 5</th>
                    <th>Header 6</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Data 1.1</td>
                    <td>Data 1.2</td>
                    <td>Data 1.3</td>
                    <td>Data 1.4</td>
                    <td>Data 1.5</td>
                    <td>Data 1.6</td>
                </tr>
                <!-- More rows -->
            </tbody>
        </table>
        <!-- / END OF TABLE CONTENT -->
    </div>

    <!-- The message to show in portrait mode -->
    <div class="orientation-message">
        Please turn your phone to landscape mode to view the full table.
    </div>
</div>
```

**2. CSS Implementation**

Now, add the CSS to define the container and the rules.

```css
/* 1. Define the container */
.table-container {
    /* Make this element a container for size/orientation queries */
    container-type: size; /* Use 'size' to query both width/height/orientation */
    /* Optional: Give it a name for clarity, especially with nested containers */
    container-name: table-area;
    width: 100%; /* Ensure it takes up available width */
    position: relative; /* Often useful for positioning children if needed */
}

/* 2. Style the message (optional, but good practice) */
.table-container .orientation-message {
    display: none; /* Hide the message by default */
    padding: 20px;
    text-align: center;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    margin: 10px 0;
    font-weight: bold;
}

/* 3. Default state: Show the table */
.table-container .comparo-table {
    display: block; /* Or whatever its default display is */
    /* Add overflow-x: auto; if you want horizontal scrolling *when visible* */
    /* overflow-x: auto; */
}

/* 4. Container Query: Apply styles when the container is portrait */
/* Target the container by name (or omit name if unambiguous) */
/* @container table-area (orientation: portrait) { */ /* Using name */
@container (orientation: portrait) {
    /* Without name if only one container */

    .table-container .comparo-table {
        display: none; /* Hide the table */
    }

    .table-container .orientation-message {
        display: block; /* Show the message */
    }
}

/* --- Alternative: Using Aspect Ratio --- */
/* Sometimes aspect-ratio is more reliable than orientation */
/* This says "when width is less than or equal to height" */
/* @container (aspect-ratio <= 1/1) {
  .table-container .comparo-table {
    display: none;
  }
  .table-container .orientation-message {
    display: block;
  }
} */

/* --- Alternative: Using Width Threshold --- */
/* If the issue is purely width, you might prefer a width threshold */
/* Replace 600px with the width below which your table breaks */
/* @container (max-width: 600px) {
  .table-container .comparo-table {
      display: none;
  }
   .table-container .orientation-message {
      display: block;
  }
} */

/* Optional: Ensure table displays correctly in landscape */
/* This is often covered by the default, but can be explicit */
@container (orientation: landscape) {
    /* You might not need this block if defaults are correct */
    .table-container .comparo-table {
        display: block; /* Or table, etc. */
    }
    .table-container .orientation-message {
        display: none;
    }
}
```

**Explanation:**

1.  **`.table-container`**: This is the crucial parent element.
    -   `container-type: size;` tells the browser that this element's dimensions and orientation can be queried by its descendants. `inline-size` might also work if the browser correctly infers orientation from aspect ratio, but `size` is more explicit for querying orientation or aspect-ratio.
    -   `container-name: table-area;` (Optional) Assigns a name, making the `@container` rule clearer if you have multiple containers on the page.
2.  **`.orientation-message`**: Styled and hidden by default (`display: none;`).
3.  **`.comparo-table`**: Shown by default (`display: block;`).
4.  **`@container (orientation: portrait)`**: This is the container query rule.
    -   It checks if the nearest ancestor with a defined `container-type` (`.table-container` in this case) has a portrait orientation (height >= width).
    -   Inside this rule, we reverse the display properties: hide the table (`display: none;`) and show the message (`display: block;`).
5.  **Alternatives:**
    -   **`aspect-ratio <= 1/1`**: Functionally very similar to `orientation: portrait`. Might be preferred in some edge cases.
    -   **`max-width: 600px`**: This is useful if the problem isn't strictly _orientation_ but rather the container simply being _too narrow_, regardless of orientation (e.g., a narrow portrait tablet vs. a wide landscape phone). Choose the threshold (`600px`) based on when your table layout breaks. This is often a more practical approach.

**Important Considerations:**

-   **Browser Support:** Container queries are relatively new but now have good support in major modern browsers. Check caniuse.com for specifics ([https://caniuse.com/css-container-queries](https://caniuse.com/css-container-queries)). Consider fallbacks if you need to support older browsers (e.g., using traditional media queries `@media (orientation: portrait)` as a less precise alternative).
-   **Container Context:** The query relates to the `.table-container` element, not the viewport (like media queries). If `.table-container` is nested inside other layout elements that constrain its size, the container query will react to _that constrained size_, which is exactly what makes them powerful.
-   **Specificity:** Ensure your CSS selectors within the `@container` rule are specific enough to override the default styles. Using the `.table-container .comparo-table` pattern helps.

Choose the condition (`orientation: portrait`, `aspect-ratio <= 1/1`, or `max-width: ...px`) that best reflects the _actual_ reason the table doesn't fit. If it's purely about portrait vs. landscape, use `orientation`. If it's about the available _width_, use `max-width`.