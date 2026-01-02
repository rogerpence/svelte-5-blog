---
title: Using @custom-media for ASNA.com responsiveness
description: Using @custom-media for ASNA.com responsiveness
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - asna-com
---
See also:

-   \*[[Add PostCSS to Sveltekit project]]

The following viewport breakpoints are defined with CSS custom properties in `_resets.css`. These custom properties define the breakpoints used at asna.com.

```
@custom-media --media-small       (width <= 768px);
@custom-media --media-medium      (width >  768px) and (width <= 1024px);
@custom-media --media-large       (width > 1024px) and (width <= 1920px);
@custom-media --media-jumbo       (width > 1920px);

@custom-media --lt-large       (width <  1024px);
@custom-media --eq-small       (width <= 768px);
@custom-media --eq-medium      (width >  768px) and (width <= 1024px);
@custom-media --eq-large       (width > 1024px) and (width <= 1920px);
@custom-media --eq-jumbo       (width > 1920px);
```

The CSS breakpoints for asna.com is defined "typical desktop" first with exceptions added as necessary. It's best to to define exceptions CSS's nesting feature. For example, the CSS below defines the typical desktop rules for `div.header-info` and uses CSS nesting to add an exception for the `--media-small` viewport.

```
div.header-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 2rem;;

    @media (--media-small) {
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-items: flex-start;
    }
}
```

Using CSS nesting works well with the componentized nature of asna.com's CSS.

## CSS nesting

CSS nesting became widely available about halfway through asna.com development. Initially, to resolve nesting's limited browser availability, asna.com used the PostCSS [postcss-nesting](https://www.npmjs.com/package/postcss-nesting) plugin (not to be confused with the [postcss-nested](https://github.com/postcss/postcss-nested) plugin).

The initial CSS nesting spec allowed CSS like this:

```
div.header-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 2rem;;

    @media (--media-small) {
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-items: flex-start;
    }

    & option {
        padding: .4rem;
        cursor: inherit;
    }
    ...
```

Chrome was the first to offer full nesting support. The original spec required that a nested rule start with an `&` if the rule didn't start with a symbol (ie, `@` or `.`). However, by the time FireFox aquired full nesting support, the `&` requirement had been removed from the spec.

As of early October, Chromium-based browsers still need the `&`, so the asna.com CSS includes it. It's presence is ignored by FireFox (per the new spec).

This change made for interesting [Can I use](https://caniuse.com/css-nesting) reporting on the nesting feature. Earlier this year, Chrome and Safari was green and Firefox was red. When FireFox went green (by implementing the new spec), Chrome and Safari revered back to partially-supported status. When Chrome and Safari, with a little testing, during CSS refactoring the `&` could be removed, but it's not going to hurt anything to leave it in place.