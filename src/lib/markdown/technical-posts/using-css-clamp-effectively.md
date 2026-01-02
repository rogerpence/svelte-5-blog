---
title: Using CSS clamp effectively
description: Using CSS clamp effectively
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
[[argyl-custom-clamp-properties]]
See Argyl's CSS clamp custom properties

### Clamp example:

```
clamp(0.3686rem, 0.6197rem + -0.324vi, 0.5549rem);
```

The clamp() function takes three parameters: clamp(minimum, preferred, maximum) and is used for responsive sizing. In your code, it's being used to create a fluid typography scale.

Let's break down one example:

Here's what each part means:

-   1rem: The minimum allowed value
-   0.9565rem + 0.2174vi: The preferred value (calculated based on viewport) 1.125rem: The maximum allowed value
-   The vi unit represents 1% of viewport inline size (width in horizontal writing modes).

So this means:

-   On very small screens, the size will be locked to 1rem
-   On very large screens, it will be locked to 1.125rem
-   Between these extremes, it will scale fluidly based on the formula 0.9565rem + 0.2174vi

## Clamp deeper dive

Let's break down what `clamp(1.4em, 5vw, 2.1em)` does for the `font-size` of an H1 tag:

The `clamp()` function creates a font size that is **fluid** (it scales with the viewport width) but **within defined limits**.

**Here's the detailed breakdown:**

`clamp()` takes three values:

1.  **`MIN` (Minimum Value): `1.4em`**

    -   This is the _absolute smallest_ the `font-size` will ever be.
    -   No matter how narrow the viewport (browser window) gets, the H1's font size will not shrink below `1.4em`.
    -   `em` is a relative unit, typically based on the font size of the parent element (or the element's default if not inherited).

2.  **`VAL` (Preferred / Ideal Value): `5vw`**

    -   This is the value the browser _tries_ to use.
    -   `vw` stands for "viewport width". `5vw` means the font size will try to be 5% of the current width of the browser window. <mark style="background: #CACFD9A6;">In most cases, this preferred value should be in `vw` units.</mark>
    -   As the browser window gets wider, `5vw` calculates to a larger pixel value, making the font grow. As it gets narrower, the font shrinks.
    -   This is what provides the **fluid scaling**.

3.  **`MAX` (Maximum Value): `2.1em`**
    -   This is the _absolute largest_ the `font-size` will ever be.
    -   No matter how wide the viewport gets, if `5vw` calculates to a value larger than `2.1em`, the font size will stop growing and stay at `2.1em`.

**How it works together:**

1.  The browser calculates the value of `5vw` based on the current viewport width.
2.  It then compares this calculated `5vw` value to `1.4em` and `2.1em`.
3.  -   If `5vw` is _less than_ `1.4em`, the browser uses `1.4em` as the font size.
    -   If `5vw` is _greater than_ `2.1em`, the browser uses `2.1em` as the font size.
    -   If `5vw` is _between_ `1.4em` and `2.1em`, the browser uses the calculated `5vw` value as the font size.

**Why use this?**

This technique is excellent for **responsive typography**. It allows the H1 heading to:

-   Scale smoothly with the browser window size (thanks to `5vw`).
-   Remain readable on small screens by preventing it from becoming too tiny (thanks to the `1.4em` minimum).
-   Avoid becoming excessively large and visually overpowering on very wide screens (thanks to the `2.1em` maximum).

It provides a clean way to achieve fluid sizing with guardrails, often reducing the need for multiple media queries just to adjust font sizes.

## The CSS clamp/elevator analogy

The elevator analogy is a really good one for explaining `clamp()`. Here's how it usually goes:

Imagine a **building (the range of possible values)**:

1.  It has a **Lowest Floor (the `MIN` value)**: This is the absolute bottom floor the elevator can reach. In your example, `1.4em`.
2.  It has a **Highest Floor (the `MAX` value)**: This is the absolute top floor the elevator can reach. In your example, `2.1em`.
3.  There's a **Desired Floor (the `VAL` or Preferred Value)**: This is the floor the elevator _wants_ to go to ideally. This floor number might change based on conditions (like how many people are waiting, or in CSS, the viewport width). In your example, this is `5vw`.

**Now, think about how the elevator operates (`clamp()`):**

-   **If the Desired Floor (`5vw`) is _between_ the Lowest Floor (`1.4em`) and the Highest Floor (`2.1em`):** The elevator goes directly to the Desired Floor. The `clamp()` function returns the `VAL` (`5vw`).
-   **If the Desired Floor (`5vw`) calculates to a floor _below_ the Lowest Floor (`1.4em`):** The elevator can't go any lower than the Lowest Floor. So, it stops at the **Lowest Floor (`1.4em`)**. The `clamp()` function returns the `MIN` (`1.4em`).
-   **If the Desired Floor (`5vw`) calculates to a floor _above_ the Highest Floor (`2.1em`):** The elevator can't go any higher than the Highest Floor. So, it stops at the **Highest Floor (`2.1em`)**. The `clamp()` function returns the `MAX` (`2.1em`).

**Applying it to your H1:**

-   The H1's font size _wants_ to be `5vw` (5% of the viewport width).
-   However, it will **never** go below `1.4em` (the lowest floor).
-   And it will **never** go above `2.1em` (the highest floor).
-   It smoothly scales based on `5vw` only when that value falls _within_ the `1.4em` to `2.1em` range.

So, the elevator analogy helps visualize how `clamp()` provides a flexible, preferred value (`VAL`) that is safely constrained within absolute minimum (`MIN`) and maximum (`MAX`) boundaries.

## Why `clamp's` desired value (it's second arg) should be a `vw` unit

You've hit on a crucial point! No, **`5vw` is absolutely _not_ a general standard** for the second value (the preferred value) in `clamp()`.

Getting that middle value right _is_ indeed key, and it's highly dependent on several factors:

1.  **The Element:** An `H1` (like in your example) generally needs to be larger and might scale more dramatically than body text (`p`), a smaller heading (`H3`), or UI elements. `5vw` might be reasonable for a large heading but would likely be _way_ too big and scale too quickly for body text.
2.  **The Design:** How much do you _want_ the element to scale?
    -   A **higher `vw` value** (like `5vw`, `7vw`, or even `10vw` for very large display text) means the size will change _more rapidly_ as the viewport width changes.
    -   A **lower `vw` value** (like `1vw`, `2vw`) means the size changes _more slowly_ and subtly.
    -   Sometimes, you might combine `vw` with a fixed unit like `rem` (e.g., `1rem + 2vw`) in the middle slot for more controlled scaling that still has a solid base.
3.  **The `MIN` and `MAX` Values:** The middle value works _in relation_ to the minimum and maximum. You choose the `MIN` and `MAX` to define the absolute boundaries, and then you choose the middle `VAL` to define _how_ it scales between those boundaries. If your `MIN` and `MAX` are very close together, the `vw` value will have less impact. If they are far apart, the `vw` value determines how quickly it traverses that range.
4.  **The Desired Breakpoints:** You often choose the `MIN`, `VAL`, and `MAX` values together so that the font size stops shrinking (hits the `MIN`) or stops growing (hits the `MAX`) at specific viewport widths that make sense for your design. You might use online `clamp()` calculators or trial-and-error in the browser's developer tools to fine-tune this.

**How to Choose the Preferred Value:**

-   **Start with a goal:** How large should this element look on a "typical" mid-size screen (like a tablet or small laptop)?
-   **Estimate a `vw`:** Make an educated guess based on the element and desired scaling speed. For headings, `3vw` to `6vw` is a common starting range. For body text, often much smaller (e.g., `0.5vw` to `1.5vw`), sometimes combined with `rem` (`calc(1rem + 0.5vw)`).
-   **Set realistic `MIN` and `MAX`:** What's the smallest readable/acceptable size (`MIN`)? What's the largest size before it becomes overpowering (`MAX`)? Use `em` or `rem` for these for better accessibility and consistency.
-   **Test and Refine:** Use browser developer tools (responsive mode) to drag the viewport width and see how the size changes. Observe:
    -   Does it scale too fast or too slow? Adjust the `vw` value.
    -   Does it get too small or too big? Adjust the `MIN` or `MAX`.
    -   At what screen width does it hit the `MIN`?
    -   At what screen width does it hit the `MAX`?
    -   Are these "switch points" appropriate for your design?

**In summary:** `5vw` is just one possible value. Choosing the right preferred value requires considering the specific element, the overall design aesthetic, the desired scaling behavior, and testing across different viewport sizes. It's more about finding the right _combination_ of `MIN`, `VAL`, and `MAX` for each specific use case.

## Another explanation of Clamp's desired value

Let me explain why using a combination of `rem` and `vi` (viewport-relative) units in the `clamp()` function is a powerful responsive design technique:

1. The `clamp()` function takes three values:

    - Minimum size (in rem)
    - Preferred size (using rem + vi)
    - Maximum size (in rem)

2. Why this combination works well:

    - `rem` provides consistent sizing based on root font size
    - `vi` (viewport-relative inline size) allows for fluid scaling based on viewport width
    - Together, they create a responsive scaling that:
        - Won't get too small on mobile devices (minimum rem)
        - Scales smoothly across different screen sizes (rem + vi)
        - Won't get too large on big screens (maximum rem)

3. Example from your code:

```css
--step-0: clamp(1rem, 0.9565rem + 0.2174vi, 1.125rem);
```

-   Minimum: `1rem`
-   Preferred: `0.9565rem + 0.2174vi` (fluid scaling)
-   Maximum: `1.125rem`

Using only `rem` would mean:

-   Fixed sizes that don't automatically adjust to viewport width
-   Need for more media queries to handle different screen sizes
-   Less smooth transitions between breakpoints

The `rem + vi` combination creates a more fluid, maintainable responsive design that scales smoothly across different device sizes while maintaining readable text sizes.

This technique is often called "fluid typography" and is considered a modern best practice for responsive design.