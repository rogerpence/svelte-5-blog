---
title: CSS custom props color stuff
description: CSS custom props color stuff
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
```
colors:
  - brand-color
  - nav-bg-color
  - page-bg-color
  - sidebar-bg-color
  - footer-bg-color

  - primary-bg-color
  - secondary-bg-color
  - danger-bg-color
  - info-bg-color
  - error-bg-color
  - warning-bg-color

  - primary-bg-color
  - secondary-bg-color
  - danger-bg-color
  - info-bg-color
  - error-bg-color
  - warning-bg-color


  - text-color
  - anchor-color
  - anchor-hover-color

  - accent-color
  - accent-bg-color

  - button-bg-color
  - button-text-color

  - menu-active-bg-color
  - menu-bg-color
```

The color generator creates light and dark versions of the colors defined. The light and dark colors

```
:root {
    /* Define colors */
    --brand-color: color;
    --nav-bg-color: color;
    --page-bg-color: color;
    --sidebar-bg-color: color;
    ...

:root {
    /* Define light colors */
    --light-brand-color: color;
    --light-nav-bg-color: color;
    --light-page-bg-color: color;
    --light-sidebar-bg-color: color;
    ...

	/* Define dark colors */
    --dark-brand-color: color;
    --dark-nav-bg-color: color;
    --dark-page-bg-color: color;
    --dark-sidebar-bg-color: color;
    ...
```

This batch file runs the generator

```
C:\Users\thumb\Documents\Projects\rputilities\librettox\
       template_work\libretto_batch_files\css-color-generator.bat
```