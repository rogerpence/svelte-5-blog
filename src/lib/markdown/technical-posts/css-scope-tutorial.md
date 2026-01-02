---
title: css-scope-tutorial
description: CSS @scope tutorial
date_updated: '2025-12-05T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
Here is a concise tutorial on **CSS `@scope`**.

## What is `@scope`?

Historically, CSS relies on **Specificity** (how "heavy" a selector is) and **Source Order** (what comes last in the file).

`@scope` introduces a new logic: **Proximity**. It allows you to select elements based on which container they are *physically closer to* in the HTML, and allows you to create boundaries where styles stop applying.


### Step 1: Basic Scoping (The Root)

The most basic usage is defining a "Root". Styles defined inside the block only apply to elements *inside* that root.

**The Scenario:** You have a `.card` component. You want to style `<img>` tags inside it without writing long selectors like `.card > header > .content > img`.

```css
@scope (.card) {
  /* This selects any <img> inside .card */
  img {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  /* You can target the root element itself using :scope */
  :scope {
    background: white;
    padding: 1rem;
  }
}
```

**Why is this better than `.card img`?**
It keeps specificity low. In standard CSS, `.card img` creates a heavier selector. With `@scope`, the specificity of `img` is just `(0,0,1)`. This makes it much easier to override these styles later if necessary.


### Step 2: Donut Scoping (The Limit)

This is the most powerful feature. You can define a **Root** (start) and a **Limit** (end). The styles apply to everything *between* the two, but stop once the Limit is reached.

**The Scenario:** You are styling a `.tab-component`. However, inside the tabs, you have a generic `.content-area` where users can put whatever they want. You don't want your tab styles messing up the user content.

```css
/* Start at .tab-component, STOP at .content-area */
@scope (.tab-component) to (.content-area) {
  
  /* Applies to text in the tabs, but NOT inside .content-area */
  h2 {
    color: blue;
    font-size: 2rem;
  }

  /* Applies to buttons in the tabs, NOT in the content */
  button {
    background: blue; 
    color: white;
  }
  
}
```


### Step 3: Proximity (The "Theme" Solver)

This is where `@scope` beats standard CSS.

In standard CSS, if you nest a Light Theme inside a Dark Theme, the browser applies whichever rule appears **last** in your CSS file. With `@scope`, the browser applies the rule from the **nearest** scope in the HTML.

**The HTML:**
```html
<div class="dark-theme">
  <a href="#">I am Dark</a>
  
  <div class="light-theme">
    <a href="#">I should be Light (because I am closer to light-theme)</a>
  </div>
</div>
```

**The CSS:**
```css
@scope (.dark-theme) {
  a { color: white; }
}

@scope (.light-theme) {
  a { color: black; }
}
```

**The Result:**
The link inside `.light-theme` will be **black**, regardless of which `@scope` block you wrote last in your CSS file. The browser sees that the link is physically closer to the `.light-theme` wrapper.


### Summary Checklist

1.  **Encapsulation:** Use it to bundle styles for a component without naming conflicts (similar to BEM, but native).
2.  **Low Specificity:** Styles inside `@scope` are easy to override because they don't add the class weight of the parent.
3.  **Donut Holes:** Use `to (...)` to protect nested content from inheriting parent styles.
4.  **Proximity:** Use it for theming to ensure nested themes work correctly based on DOM distance.