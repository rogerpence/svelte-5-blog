---
title: How to use PostCSS and OpenProps with Sveltekit
description: How to use PostCSS and OpenProps with Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - postcss
  - css
  - asna-com
---
[[add-postcss-to-sveltekit-project|See this doc too--I am not sure which came first]]

**Step 1:** Use svelte-add to install `PostCSS`:

Note: confirm this installs the `postcss-load-config` plugin. If it doesn't, add it to the list below.

```
npx svelte-add@latest postcss
```

This step installs a `app.postscss` file in the `src` root. This is meant to be the app's global style sheet. It's weird that it doesn't have a `.css` extension--so change the file's name to `app.postscss.css`. Change the corresponding import (that the `PostCSS` install injected in the root `+layout.svelte` file) to reflect this name change. In Step 4, we'll see how to use this `app/postcss.css` file.

\*\*Step 2: Install PostCSS plugins with NPM/PNPM

\*\*I use these `PostCSS` plugins:

```
open-props
postcss-jit-props
postcss-custom-media
postcss-import
postcss-media-minmax
postcss-nesting
```

I'm a big fan of [CSS Open Props](https://open-props.style/). If you don't want to use CSS Open Props you can omit the `open-props` and the `postcss-hit-props` plugin. Install these plugins as dev dependencies.

My goal with PostCSS is to create standards-compliant CSS. These plugins:

-   postcss-custom-media
-   postcss-import
-   postcss-media-minmax
-   postcss-nesting

all produce standards-compliant CSS.

> You don't need to install and configure `CSSNano` because Vite and PostCSS implicitly compile/compress the CSS with the Sveltekit build step: `pnpm run build`. More on this shortly.

**Step 3.** include your PostCSS plugins

If you want to use `CSS Open Props`, change the `postcss.config.cjs` to:

```
const openProps = require('open-props');

module.exports = {
	map: { inline: true },
	plugins: [
		require('postcss-import'),
		require('postcss-nesting'),
		require('postcss-custom-media'),
		require('postcss-media-minmax'),
		require('postcss-jit-props')(openProps)
	]
};
```

This last line is where Open Props magic happens:

```
require('postcss-jit-props')(openProps)
```

This line causes PostCSS to include in the final CSS only the Open Props that are referenced in your CSS.

**Step 4.** Writing your CSS with PostCSS and Svelte

The CSS files that comprise the final CSS that PostCSS builds are in the `./src/css-dev folder`:

```.
└── src
    ├── css-dev
    │   ├── _configure.css
    │   ├── _forms.css
    │   ├── _page.css
    │   ├── _resets.css
    │   └── _utility.css
    ├── lib
    ├── routes
    ├── ...
    ├── +layout.svelte
    ├── +page.svelte
    └── app.postcss.css
```

The `app.postcss.css` file then imports them into the final CSS. Remember these `@imports` are build-time imports. When you run `npm run build` Vite quite magically produces a single, compressed CSS file from these imports.

```
@import "./css-dev/_configure.css";
@import "./css-dev/_resets.css";
@import "./css-dev/_page.css";
@import "./css-dev/_forms.css";
@import "./css-dev/_utility.css";

:root {
	// Application-specific variables.
    --accent-color: var(--orange-7);
    ...
}
```

After doing `npm run build` you can see the compiled CSS here: (the CSS file name will vary)

```
.svelte-kit\output\client\_app\immutable\assets\0.2b389f06.css
```

### Using Vite with PostCSS and Open Props is so cool

By using [postcss-jit-props](https://github.com/GoogleChromeLabs/postcss-jit-props), you can now use any of the CSS Open Props in your CSS and Vite uses PostCSS to ill ensure that the variables are selectively imported for you (that is, the only CSS Open Props imported are the ones you need).

For example, a `+page.svelte` file like this:

```
<h1>About</h1>

<style>
	h1 {
		color: var(--purple-4);
		font-size: var(--font-size-2);
	}
</style>
```

Injects this CSS during the Sveltekit build process:

```
:root{--purple-4:#da77f2;--font-size-2:1.1rem}h1.svelte-6n23wp{color:var(--purple-4);font-size:var(--font-size-2)}
```

You don't need to worry about any explicit CSS tree shaking. In the blink of an eye, the `post-jit-props` `PostCSS` plugin prunes your CSS to include only the Open Props variables referenced in your app's CSS.

This process is crazy fast (you won't notice any lag during development as Vite/PostCSS keeps your CSS current) and there is hardly any configuration. What's not to love!

```
const openProps = require("open-props");
//const postcssGlobalData = require("@csstools/postcss-global-data");

// console.log(openProps);

module.exports = {
  map: { inline: true },
  plugins: [
    require("postcss-import"),
    require("postcss-nesting"),
    require("postcss-custom-media"),
    require("postcss-media-minmax"),
    // require("@csstools/postcss-global-data")({
    //   files: ["node_modules://open-props/media.min.css"],
    // }),
    require("postcss-jit-props")(openProps),
    // require("postcss-preset-env")({
    //   "custom-media-queries": true,
    // }),
    ...(process.env.NODE_ENV === "production" ? [require("cssnano")] : []),
  ],
};
```

### Nov 2024 update

This project has a PostCSS install that is working and that uses the `postcss.config.cjs` below.

```
C:\Users\thumb\Documents\projects\svelte\forms-handling
```

This is the latest `postcss.config.cjs`

```
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');
const postcssCustomMedia = require('postcss-custom-media');
const openProps = require('open-props');
const postcssJitProps = require('postcss-jit-props');
const postcssGlobalData = require('@csstools/postcss-global-data');
const purgecss = require('@fullhuman/postcss-purgecss');
const DO_NOT_PRESERVE_UNRESOLVED_RULE = false;

module.exports = {
	plugins: [
		postcssImport(),
		postcssJitProps(openProps),
		postcssGlobalData({
			files: ['./node_modules/open-props/src/props.media.css']
		}),
		postcssCustomMedia({
			preserve: DO_NOT_PRESERVE_UNRESOLVED_RULE
		}),

		...(process.env.NODE_ENV === 'production'
			? [purgecss(
				{
					content: ['./src/routes/**/*.svelte'],
					safelist: ['mt-48'],
				}
			)]
			: []),

		...(process.env.NODE_ENV === 'production' ? [cssnano()] : [])
	]
};
```

Note that it includes all `*.svelte*` from `./src/routes` down. I know this works with the local build process, but I am not sure that it does with the Vercel build process.

> [!warning]
> Test that CSS tree shaking works on Vercel.

To use that `postcss.config.cjs`:

### Install these NPM packages as dev dependencies

-   postcss
-   postcss-cli
-   cssnano
-   open-props
-   postcss-custom-media
-   postcss-import
-   postcss-jit-props
-   @csstools/postcss-global-data
-   @fullhuman/postcss-purgecss

### Add a `./css-dev` folder

It should have a `main.css` file with as many `@imports` as necessary
For example:

```
@import "./resets.css";
@import "./utilities.css";
```

When changes in any of these files occur, the `./scr/main.css` output file is (very quickly) recreated.

### The `/src/main.css` file is referenced in the `./src/routes/+layout.svelte`

Svelte 4

```
<script>
    import '../main.css';
</script>

<slot />
```

Svelte 5

```
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// CSS should be in the root of the SvelteKit app. 
	import '../pico.css'; // import global CSS

	let { children } = $props();
</script>

<div class="layout-container">
	<main>
		{@render children()}
	</main>
</div>
```