---
title: CSS :is pseudo selector
description: CSS :is pseudo selector
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
Example

```
header :is(h1, a) {
	...
}
```

1.  **`header`**: This selects any HTML element with the tag name `<header>`.

2.  **` ` (Space)**: This is the **descendant combinator**. It means the selector that follows must match an element that is _inside_ (a descendant of) the element matched by the selector before it. It doesn't have to be a direct child; it can be nested multiple levels deep.

3.  **`:is(h1, a)`**: This is the **`:is()` pseudo-class**. It takes a list of selectors as arguments and matches any element that can be selected by _any_ of the selectors in that list. It essentially acts like an "OR" condition for the element it's applied to.
    -   `h1`: Selects any `<h1>` element.
    -   `a`: Selects any `<a>` (anchor/link) element.

**Putting it all together:**

The selector `header :is(h1, a)` selects:

-   Any `<h1>` element **that is a descendant** (anywhere inside) of a `<header>` element.
-   **OR**
-   Any `<a>` element **that is a descendant** (anywhere inside) of a `<header>` element.

**In simpler terms:** It finds all `<h1>` tags and all `<a>` tags that are located somewhere within a `<header>` tag.

**Example:**

```html
<header>
    <h1>Main Title</h1>
    <!-- Selected -->
    <nav>
        <ul>
            <li><a href="#">Home</a></li>
            <!-- Selected -->
            <li><a href="#">About</a></li>
            <!-- Selected -->
        </ul>
    </nav>
    <p>Some text <a href="#">inline link</a></p>
    <!-- The <a> is Selected -->
</header>

<main>
    <h1>Another Title</h1>
    <!-- NOT Selected (not inside <header>) -->
    <a href="#">Another Link</a>
    <!-- NOT Selected (not inside <header>) -->
</main>
```

In this example, the `<h1>` inside the `<header>` and all three `<a>` tags inside the `<header>` would be selected by `header :is(h1, a)`. The `<h1>` and `<a>` inside the `<main>` element would not be selected.

**Why use `:is()`?**

Without `:is()`, you would have to write this as:

```css
header h1,
header a {
    /* styles */
}
```

`:is()` makes the selector shorter, more readable, and easier to maintain, especially when dealing with more complex descendant paths or longer lists of potential elements.

## What is the difference between `:is` and `:where`?

The difference between `:is()` and `:where()` is subtle but crucial, and it boils down entirely to **specificity**.  They function almost identically in terms of which elements they match.

Functionally, they do the same thing:

-   Both take a list of selectors as arguments.
-   Both match any element that can be selected by _any_ of the selectors in that list (like an "OR" condition).

The key difference lies in how they contribute to the overall specificity of the selector:

1.  **`:is(<selector-list>)`**:

    -   The specificity of the `:is()` pseudo-class itself is replaced by the specificity of its **most specific argument** in the selector list.
    -   **Think:** It _adopts_ the highest specificity from within its list.
    -   **Consequence:** Using `:is()` can potentially _increase_ the overall specificity of your rule, making it harder to override later if one of its arguments is highly specific (like an ID).

2.  **`:where(<selector-list>)`**:
    -   The specificity of the `:where()` pseudo-class (and its arguments) is **always zero (0)**.
    -   **Think:** It contributes _nothing_ to the specificity calculation, regardless of how specific its arguments are.
    -   **Consequence:** Using `:where()` allows you to group selectors _without_ adding any specificity. This makes the rule very easy to override and is ideal for setting base styles or defaults.

**Analogy:**

Imagine you have two groups of people (`:is()` and `:where()`) applying for a priority pass.

-   The `:is()` group gets a priority level equal to the _highest_ priority member within their group. If they have a VIP (#id) with them, the whole group gets VIP priority.
-   The `:where()` group _always_ gets the lowest priority (zero), no matter who is in their group, even if they have VIPs with them.

**Example:**

Let's look at how specificity is calculated:

```css
/* --- Using :is() --- */

/* Selects any h1, h2, or element with class .title inside a <section> */
/* Specificity calculation: */
/* section (0,0,1) + :is(h1(0,0,1), h2(0,0,1), .title(0,1,0)) */
/* :is() takes the specificity of .title (0,1,0) because it's the highest */
/* Total Specificity: (0,1,1) - same as 'section .title' */
section :is(h1, h2, .title) {
    color: blue;
}

/* Selects any h1, h2, or element with ID #main-title inside a <section> */
/* Specificity calculation: */
/* section (0,0,1) + :is(h1(0,0,1), h2(0,0,1), #main-title(1,0,0)) */
/* :is() takes the specificity of #main-title (1,0,0) */
/* Total Specificity: (1,0,1) - same as 'section #main-title' */
section :is(h1, h2, #main-title) {
    font-style: italic;
}

/* --- Using :where() --- */

/* Selects any h1, h2, or element with class .title inside a <section> */
/* Specificity calculation: */
/* section (0,0,1) + :where(h1, h2, .title) */
/* :where() and its arguments contribute ZERO specificity (0,0,0) */
/* Total Specificity: (0,0,1) - same as just 'section' */
section :where(h1, h2, .title) {
    font-weight: normal; /* Easy to override */
}

/* Selects any h1, h2, or element with ID #main-title inside a <section> */
/* Specificity calculation: */
/* section (0,0,1) + :where(h1, h2, #main-title) */
/* :where() and its arguments contribute ZERO specificity (0,0,0) */
/* Total Specificity: (0,0,1) - same as just 'section' */
section :where(h1, h2, #main-title) {
    text-decoration: underline; /* Easy to override, even the ID rule */
}
```

**When to Use Which:**

-   **Use `:is()` when:**

    -   You are simply grouping selectors for brevity and _want_ the natural specificity of those selectors to apply.
    -   You intend for the rule to have a certain level of precedence based on its contents.

-   **Use `:where()` when:**
    -   You want to create low-specificity rules that are easily overridden.
    -   You are writing baseline styles, resets (like setting default margins/paddings on headings), or theme defaults in a library/framework.
    -   You want to avoid accidentally increasing specificity when grouping selectors.

In summary: `is(A, B)` selects A or B and has the specificity of the more specific one between A and B. `where(A, B)` selects A or B but _always_ has zero specificity itself.