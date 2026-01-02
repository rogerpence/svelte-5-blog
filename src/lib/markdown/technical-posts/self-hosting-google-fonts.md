---
title: Self-hosting Google fonts
description: Self-hosting Google fonts
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - web-dev
---
> [!info]
> ASNA.com originally used Google Fonts but loading them directly from Google raises GDPR concerns. I considered self-hosting them but this [Kevin Powell](https://www.youtube.com/watch?v=VOd6jfAImV4) convinced me that using basic system fonts was a better strategy.

Google fonts are great, but they are also a potential GDPR violation and there is overhead loading them from the Google site.

-   You won't have to worry about Google changing the font
-   More performant.

[Google doc on self-hosting Google fonts.](https://fonts.google.com/knowledge/using_type/self_hosting_web_fonts)

ASNA.com uses the regular 400 version of the [Google Open Sans font](https://fonts.google.com/specimen/Open+Sans?query=open+sans). Go to the font link.

Google shows the link for this font as:

```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital@0;1&display=swap" rel="stylesheet">
```

Display the font in your browser:

```
https://fonts.googleapis.com/css2?family=Open+Sans:ital@0;1&display=swap
```

to see many language variations listed. Copy the entire Latin @font-face tag.

![[Pasted image 20231201112143.png]]

Paste its URL your browser to download the font.

```
https://fonts.gstatic.com/s/opensans/v36/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2
```

Put that font in the project's `static\fonts` folder. SvelteKit exposes this `static` folder as the root of the site when the site is deployed. Browser dev tools show the font as being loaded from:

```
/fonts/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2
```

In the `\resets.css` file, add the @font-face declaration from above:

```
@font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 400;
        font-stretch: 100%;
        font-display: swap;
        src: url(/fonts/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
```

Note how the url of the @font-face tag above shows the font file living in the /fonts folder directly off the root. That matches where we put the font.

The body selector in `\resets.css` sets 'Open Sans' as the current font.

```
body {
        font-family: 'Open Sans', 'Atkinson Hyperlegible', sans-serif;
        background-color: var(--page-bg-color);
        color: var(--text-color);
}
```