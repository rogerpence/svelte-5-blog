---
title: CSS scoped styles
description: CSS scoped styles
date_created: '2025-06-10T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
Of course! Here is a short tutorial on using CSS's new `@scope` feature.


## Scoped Styles are Here! A Short Tutorial on CSS `@scope`

For years, developers have used methodologies like BEM or CSS-in-JS to prevent styles from "leaking" out of components and affecting the rest of the page. The new CSS `@scope` at-rule provides a native, browser-level solution to this exact problem.

Let's dive in.

#### What is `@scope`?

`@scope` allows you to apply style rules to a specific section—or "scope"—of your HTML document. This means the styles you write inside an `@scope` block will only affect elements within a designated DOM tree, preventing them from accidentally styling elements elsewhere.

#### The Problem `@scope` Solves

Imagine a common card component. You might write CSS like this:

```css
/* Potentially global and leaky */
.card h2 {
  font-size: 1.5rem;
  color: #333;
}

.card p {
  line-height: 1.6;
}
```

This works, but if you nest another component with an `<h2>` inside your card, it will unintentionally inherit these styles. This leads to high-specificity overrides and messy code.

#### The `@scope` Solution: Basic Scoping

`@scope` solves this by defining a **scoping root**. Any style rules inside the block will only apply to descendants of that root.

**Syntax:** `@scope ( <scoping-root> ) { ... }`

Let's rewrite our card styles using `@scope`:

**HTML:**
```html
<article class="card">
  <img src="image.jpg" alt="A nice image.">
  <h2>Card Title</h2>
  <p>Some descriptive text for the card.</p>
</article>

<!-- This h2 is NOT affected -->
<h2>Another Title on the Page</h2>
```

**CSS:**
```css
@scope (.card) {
  /* These styles only apply to elements inside .card */
  h2 {
    font-size: 1.5rem;
    color: #333;
  }

  p {
    line-height: 1.6;
  }
}
```

Now, only the `<h2>` and `<p>` inside an element with the class `.card` will be styled. The global `<h2>` remains unaffected.

#### Targeting the Root with `:scope`

What if you want to style the scoping root element itself (`.card` in our case)? You can use the `:scope` pseudo-class.

```css
@scope (.card) {
  :scope {
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  h2 {
    /* ... styles for h2 inside the card */
  }
}
```
Here, `:scope` refers directly to the element matching `.card`.

#### Advanced: Scoping with a Limit (The "Donut Scope")

This is where `@scope` gets really powerful. You can define not only a starting root but also an **ending limit**. Styles will be applied *within* the root but will *stop* at the limit.

**Syntax:** `@scope ( <root> ) to ( <limit> ) { ... }`

Imagine our card contains a special "promo" block, and we *don't* want the card's paragraph styles to apply inside it.

**HTML:**
```html
<article class="card">
  <h2>Card Title</h2>
  <p>This paragraph should be styled.</p>
  
  <div class="promo-block">
    <h3>Special Offer!</h3>
    <p>This paragraph should NOT be styled by the card's scope.</p>
  </div>
</article>
```

**CSS:**
```css
@scope (.card) to (.promo-block) {
  /* 
    These styles apply inside .card but NOT inside .promo-block.
    This is often called a "donut scope".
  */
  p {
    color: #555;
    margin-bottom: 1rem;
  }
}
```
In this example, only the first paragraph gets the `color: #555` style. The style rule stops at the boundary of `.promo-block`, protecting its contents.

#### Key Differences from CSS Nesting

It's easy to confuse `@scope` with CSS Nesting. They are different!

*   **Nesting:** Is syntactic sugar. `.card { h2 { ... } }` is compiled to `.card h2 { ... }`. It doesn't prevent style leaks and actually increases specificity.
*   **`@scope`:** Is a true scoping mechanism. It changes how styles are applied and has special rules for specificity. Scoped styles have a lower specificity than standard styles, but they win based on **proximity**—the styles from the nearest scoping root are applied.

#### Browser Support

`@scope` is a very new feature. As of late 2023 / early 2024, it is available in **Chrome 118+**, **Edge 118+**, and **Safari Technology Preview**. It is not yet supported in Firefox.

Always check **[Can I Use...](https://caniuse.com/css-scope)** for the latest browser support information before using it in production.

### Conclusion

`@scope` is a game-changer for writing component-based, encapsulated CSS without relying on external tools or complex naming conventions. It gives us:

1.  **True Encapsulation:** Styles don't leak out.
2.  **Lower Specificity:** Easier to override styles when needed.
3.  **Proximity-Based Styling:** The closest ancestor scope wins.
4.  **Cleaner HTML:** No need for long, repetitive BEM class names.

Start experimenting with it today in supported browsers to get a feel for the future of component styling in CSS