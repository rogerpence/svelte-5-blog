---
title: argyl-custom-clamp-properties
description: argyl-custom-clamp-properties
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
```css
--size-fluid-1: clamp(0.5rem, 1vw, 1rem);
--size-fluid-2: clamp(1rem, 2vw, 1.5rem);
--size-fluid-3: clamp(1.5rem, 3vw, 2rem);
--size-fluid-4: clamp(2rem, 4vw, 3rem);
--size-fluid-5: clamp(4rem, 5vw, 5rem);
--size-fluid-6: clamp(5rem, 7vw, 7.5rem);
--size-fluid-7: clamp(7.5rem, 10vw, 10rem);
--size-fluid-8: clamp(10rem, 20vw, 15rem);
--size-fluid-9: clamp(15rem, 30vw, 20rem);
--size-fluid-10: clamp(20rem, 40vw, 30rem);
```

Okay, here is a table summarizing the approximate minimum and maximum font sizes for each CSS custom property, based on the `clamp()` function's arguments.

The `clamp(MIN, PREFERRED, MAX)` function sets a value that:

-   Won't go below `MIN`.
-   Won't go above `MAX`.
-   Will try to use the `PREFERRED` value (which scales with the viewport width `vi`) when it falls between `MIN` and `MAX`.

Therefore, the `MIN` and `MAX` values represent the effective smallest and largest font sizes for each step. Since these are already provided in `rem`, we can directly use them. I've also added the approximate pixel equivalents assuming a standard root font size of `16px` (`1rem = 16px`).

**Approximate Font Size Ranges for CSS Steps**

| Property Name | Minimum Size (rem) | Minimum Size (px\*) | Maximum Size (rem) | Maximum Size (px\*) | Description                                   |
| :------------ | :----------------- | :------------------ | :----------------- | :------------------ | :-------------------------------------------- |
| `--step--5`   | 0.3686             | ~5.9 px             | 0.5549             | ~8.9 px             | Very small text (e.g., fine print)            |
| `--step--4`   | 0.4608             | ~7.4 px             | 0.6243             | ~10.0 px            | Very small text                               |
| `--step--3`   | 0.576              | ~9.2 px             | 0.7023             | ~11.2 px            | Small text (e.g., captions, footnotes)        |
| `--step--2`   | 0.72               | ~11.5 px            | 0.7901             | ~12.6 px            | Small text                                    |
| `--step--1`   | 0.8889             | ~14.2 px            | 0.9                | 14.4 px             | Slightly smaller than body text               |
| `--step-0`    | **1**              | **16.0 px**         | **1.125**          | **18.0 px**         | **Base body text size**                       |
| `--step-1`    | 1.125              | 18.0 px             | 1.4063             | ~22.5 px            | Slightly larger than body (e.g., subheadings) |
| `--step-2`    | 1.2656             | ~20.3 px            | 1.7578             | ~28.1 px            | Small heading / Large subheading              |
| `--step-3`    | 1.4238             | ~22.8 px            | 2.1973             | ~35.2 px            | Heading (e.g., H3)                            |
| `--step-4`    | 1.6018             | ~25.6 px            | 2.7466             | ~43.9 px            | Heading (e.g., H2)                            |
| `--step-5`    | 1.802              | ~28.8 px            | 3.4332             | ~54.9 px            | Large heading (e.g., H1)                      |
| `--step-6`    | 2.0273             | ~32.4 px            | 4.2915             | ~68.7 px            | Very large heading / Display                  |
| `--step-7`    | 2.2807             | ~36.5 px            | 5.3644             | ~85.8 px            | Display size text                             |
| `--step-8`    | 2.5658             | ~41.1 px            | 6.7055             | ~107.3 px           | Large display size text                       |

_(\*Approximate pixel values assume a root font size of 16px. Actual rendered size may vary based on user browser settings.)_

This table quickly shows the lower and upper bounds (in both `rem` and approximate `px`) for the font size defined by each custom property. The text will scale smoothly between these minimum and maximum values based on the viewport width.