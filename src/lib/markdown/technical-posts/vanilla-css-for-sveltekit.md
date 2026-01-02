---
title: Vanilla CSS for Sveltekit
description: Vanilla CSS for Sveltekit
date_updated: '2025-12-15T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - css
---
This document shows how to use vanilla CSS without an preprocessing. Given how much CSS has improved over the last couple of years, it's hard to make a good case for PostCSS. 
* The Sveltekit build step (with Vite's help) automatically compresses CSS.
* CSS's @import (which may, or may now, impede performance) runs at SvelteKit so it's performance is a moot point.

```
└── src/
    ├── css  /
    │   ├── components/
    │   │   ├── _components.css
    │   │   └── button.css
    │   ├── elements/
    │   │   ├── _elements.css
    │   │   └── select.css
    │   ├── global/
    │   │   ├── _global.css
    │   │   ├── reset.css
    │   │   ├── tags.css
    │   │   └── vars.css
    │   ├── layouts/
    │   │   └── _layouts.css
    │   ├── utilities/
    │   │   └── _utilities.css
    │   └── _style.css      
    ├── lib/
    │   ├── assets/
    │   │   └── favicon.svg
    │   └── routes/
    │       ├── +layout.svelte
    │       └── +page.svelte    
    ├── routes/
    │   └── ..      
    └── style.css
```

`+layout.svelte`

```ts
<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../style.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
```

`src/css/_style.css_`

```
@layer global, layouts, elements, components, utilities;

/* @import "https://unpkg.com/open-props" layer(global); */
@import './global/_global.css' layer(global);
@import './layouts/_layouts.css' layer(layouts);
@import './elements/_elements.css' layer(elements);
@import './components/_components.css' layer(components);
@import './utilities/_utilities.css' layer(utiilties);
```

`src/style.css`

```
@import './css/_style.css';
```

This is the swindle that makes this all work. At build time (or runtime in dev mode), `_style_.css` imports the various CSS files. Then `/css/style.css` imports the rendered `_style_.css` contents. It's almost magic--CSS `@imports` are driving all of this. At build time, Sveltekit and Vite produce a concrete, compressed, version of `/css/style.css`. That single, static CSS file is produced at (where `<hash>` is the hash file name created.)

`.svelte-kit\output\client\_app\immutable\assets\<hash>.css`

By the way, this CSS process occurs without any configuration! 

`routes/+layout.svelte`

```
<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../style.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
```


> [!info]
> I avoided using @import with the original ASNA.com because of the potential performance implications of using `@import`. However, that was silly because I didn't understand how powerful the Sveltekit/Vite build process is. 
## Implementation details

Each directory under `css` is a category of css that is assigned to a given layer. 

_global.css

```css
@import "reset.css";
@import "vars.css";
@import "tags.css";
```

reset.css

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Prevent font size inflation */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

/* Remove default margin in favour of better control in authored CSS */
body, h1, h2, h3, h4, p,
figure, blockquote, dl, dd {
  margin-block-end: 0;
} 

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

u, ol {
  font-size: inherit;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  line-height: 1.5;
}

/* Set shorter line heights on headings and interactive elements */
h1, h2, h3, h4,
button, input, label {
  line-height: 1.1;
}

/* Balance text wrapping on headings */
/* h1, h2,
h3, h4 {
  text-wrap: balance;
}  */

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input, button,
textarea, select {
  font-family: inherit;
  font-size: inherit;
}

/* Make sure textareas without a rows attribute are not tiny */
textarea:not([rows]) {
  min-height: 10em;
}

/* Anything that has been anchored to should have extra scroll margin */
:target {
  scroll-margin-block: 5ex;
}
```


The `?.` is the **optional chaining operator**. It safely handles cases where `children` might be `undefined` or `null`.

## What it does

```svelte
{@render children?.()}
```

This means:
- **If `children` exists**: Render it
- **If `children` is `undefined` or `null`: Do nothing (no error thrown)

## Without optional chaining

```svelte
{@render children()}
```

This would throw an error if `children` is `undefined`.

## Why it's needed

In SvelteKit layouts, the `children` snippet represents the content of child routes. There might be edge cases during:
- Initial rendering
- Route transitions
- Error states

Where `children` could temporarily be `undefined`.

## Equivalent to

```javascript
// In regular JavaScript
children ? children() : undefined
```

The `?.()` is specifically for optional function/snippet calls. There's also:
- `object?.property` - optional property access
- `array?.[index]` - optional array indexing

This is a defensive programming practice to prevent runtime errors when the snippet might not be available.