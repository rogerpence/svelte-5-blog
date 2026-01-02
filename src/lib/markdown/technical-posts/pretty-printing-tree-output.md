---
title: Pretty printing Trree output with line drawing ASCII characters.
description: Pretty printing Trree output with line drawing ASCII characters.
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
---
Question:

```
Pretty print this text replacing the plus signs, bar character, and dash character with higher order ascii line drawing characters:
+---.vs
¦   +---WorkWithAjax
¦       +---config
¦       +---CopilotIndices
¦       ¦   +---17.13.441.19478
¦       +---FileContentIndex
¦       +---v17
+---App_Code
+---assets
¦   +---css
¦   ¦   +---smoothness
¦   ¦       +---images
¦   +---js
+---Bin
+---services
+---views
+---main
```

Answer:

```
├───.vs
│   ├───WorkWithAjax
│   │   ├───config
│   │   ├───CopilotIndices
│   │   │   └───17.13.441.19478  <-- Adjusted last item marker for clarity
│   │   ├───FileContentIndex
│   │   └───v17                <-- Adjusted last item marker for clarity
├───App_Code
├───assets
│   ├───css
│   │   └───smoothness         <-- Adjusted last item marker for clarity
│   │       └───images         <-- Adjusted last item marker for clarity
│   └───js                   <-- Adjusted last item marker for clarity
├───Bin
├───services
└───views                    <-- Adjusted last item marker for clarity
    └───main                 <-- Adjusted last item marker for clarity
```

**Explanation of Characters Used:**

-   `│` (U+2502 Box Drawings Light Vertical): Replaced `¦`
-   `─` (U+2500 Box Drawings Light Horizontal): Replaced `-`
-   `├` (U+251C Box Drawings Light Vertical and Right): Replaced `+` when it's an intermediate item in a list.
-   `└` (U+2514 Box Drawings Light Up and Right): Replaced `+` when it _should_ be the last item in a list