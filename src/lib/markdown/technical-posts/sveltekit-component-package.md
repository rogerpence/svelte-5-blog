---
title: How to create a SvelteKit component package
description: How to create, package, and consume a SvelteKit library component.
date_updated: '2025-12-16T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
A SvelteKit component package encapsulates Sveltekit components into a reusable library. The library is hosted on GitHub and is added to consuming projects with NPM or PNPM (or other) package managers. 

Rather than deploying this project to the [NPM registry](npmjs.com), this project gets pushed to a GitHub repository and consuming projects will install it from GitHub. If you're creating a component intended for open source use by a broad set of users, you should probably publish your project to the NPM registry. That's not the challenge that this project strategy solves. 

I build medium-to-large website and want to provide separation of concerns for my proprietary SvelteKit components and TypeScript libraries. I want these libraries easily reusable across several applications. I also may want these libraries to be private and the free NPM account doesn't provide private packages; using GitHub you can "privatize" your SvelteKit libraries for free. More on pushing a SvelteKit component library to GitHub later. 
## `package.json` difference

One of the primary differences between a Sveltekit application project and a SvelteKit library project is that a library project's `package` includes a `prepack` which provides a step to build this project for use as a component. More in this later. 
## Step 1. Create a SvelteKit library project

![[image-64.png|711x284]]

A library project lets you create SvelteKit components to package for use by consuming SvelteKit projects. 

At a glance, a library project appears to be a a minimal SvelteKit project. In development, it even feels like a regular ol' SvelteKit project. The difference is that with a library project, by default, nothing under the routes folder is exported. Let's look deeper at a full, but minimal, example SvelteKit Library project. 

The example component manages paging through pages of rows of data. Its "previous" button provides an anchor tag with a link to the previous page and the "next" button provides an anchor tag with a link to the next page. This component doesn't fetch or display any data, its only job is to provide links for paging through the data. 

![[image-65.png]]

This example also provides basis CSS for the paging component. The consuming project has access to that CSS, or it can provide its own custom CSS for the component. 

### Directory structure 

While this is a library project, its directory structure is essentially the same is a regular SvelteKit project. The big difference is that while the `routes` folder and its sub-routes can be used to test the components the project provides, nothing under `routes` is exported. The consuming project provides pages and uses the components.

```
.
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── NextPrevAction.svelte
│   │   ├── css/
│   │   │   └── next-prev-action/
│   │   │       ├── root.css
│   │   │       ├── component.css        
│   │   │       └── utlities.css  
│   │   └── index.ts          
│   └── routes/
│       ├── next-prev-action/
│       │   └── +page.svelte
│       ├── +layout.svelte
│       └── +page.svelte    
├── app.d.ts (unchanged from default)
├── app.html (unchanged from default)        
└── style.css    
```

### The component code
`NextPrevAction.svelte`

This is the `NextPrevAction.svelte` component code. It doesn't know anything about the data that is being paged. Its properties are:
- `totalPages` - the total pages available in the dataset.
- `pageNumber` - the current page number being displayed.
- `navRoute` - the route to which the 'next' and 'previous' actions navigate.
- `pageNumberKey` (optional) name of search parameter that provides page number. This defaults to `pagenumber`.

```ts
<script lang="ts">
	export interface Props {
		totalPages: number;
		pageNumber: number;
		navRoute: string;
		pageNumberKey?: string;
	}

	let { totalPages, pageNumber, navRoute, pageNumberKey = 'pagenumber' }: Props = $props();

	const nextPageNumber = $derived(pageNumber ? pageNumber + 1 : 0);
	const prevPageNumber = $derived(pageNumber ? pageNumber - 1 : 0);

	const isFirstPage = $derived(pageNumber == 1);
	const isLastPage = $derived(pageNumber == totalPages);

	// $inspect(isFirstPage, isLastPage, pageNumber);
</script>

<div class="page-navigator-container">
	<a
		aria-disabled={pageNumber === 1}
		class:disabled={pageNumber === 1}
		href="{navRoute}?{pageNumberKey}={prevPageNumber}"
		><i class="icon previous-icon"></i> Previous</a
	>
	Page {pageNumber} of {totalPages}
	<a
		aria-disabled={pageNumber === totalPages}
		class:disabled={pageNumber === totalPages}
		href="{navRoute}?{pageNumberKey}={nextPageNumber}">Next <i class="icon next-icon"></i></a
	>
</div>
```

### The CSS code

This CSS is exported from the component and available to consuming projects. Consuming projects could also ignore this CSS code a/nd provide their own component CSS.

`root.css`

This provides a right-pointing arrowhead. A CSS transform flips it to be left-pointing--making only one SVG necessary.

```
:root {
    --icon-arrowhead-right: url('data:image/svg+xml,<svg...>...</svg>');
}    
```

`component.css`

This is basic component styling.  

```css
@scope (div.page-navigator-container) {
	:scope {
		color: black;
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-block-start: 2rem;
	}

	a {
		display: flex;
		align-items: center;
		justify-content: center;
		color: black;
		text-decoration: none;

		&:hover {
			outline: 1px solid red;
		}
	}

	i {
		font-size: 1.4rem;
		color: black;
		cursor: pointer;
	}

	i.icon {
		width: 16px;
		height: 16px;
		mask-repeat: no-repeat;
		-webkit-mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-position: center;
	}

	i.next-icon {
		background-color: gray;
		mask-image: var(--icon-arrowhead-right);
		-webkit-mask-image: var(--icon-arrowhead-right);
	}

	i.previous-icon {
		background-color: gray;
		mask-image: var(--icon-chevron-right);
		-webkit-mask-image: var(--icon-arrowhead-right);
		transform: scaleX(-1);
	}
}
```

`utilities.css`

A utility class to disable an element.

```
.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
}
```

### Exporting component and its Props types

This is very critical code. Without it, there is nothing for a consuming project to import. 

`index.ts`

```
// Export your components here.
export { default as NextPrevAction } from './components/NextPrevAction.svelte';
  
// Export props type.
export type { Props as NextPrevActionProps } from './components/NextPrevAction.svelte';
```

This example shows the SvelteKit project exporting only one component. In most component libraries you'll export many components and their types in the `index.ts` file.
### A sample/test page to test the `NextPrevAction` component.
While the SvelteKit component libraries don't export the `src` folder (and therefore any routes and pages the library may have), you can add routes and pages to test the components in the library. The packaging process ignores the `src` folder and its contents.

> [!note]
> In this example, the `pageNumberKey` default property value (`pagenumber`) is used.

`next-prev-action/+page.svelte`

```
<script lang="ts">
	import NextPrevAction from '$lib/components/NextPrevAction.svelte';
	
    import '$lib/css/next-prev-action/root.css';
    import '$lib/css/next-prev-action/utilities.css';
    import '$lib/css/next-prev-action/component.css';	

	const totalPages = 21;
	const pageNumber = 1;
	const navRoute = '/technical-posts';
</script>

<NextPrevAction {navRoute} {totalPages} {pageNumber}></NextPrevAction>
```

The above code imports the CSS it needs for component. This is not what you would do in production but it works fine for testing the component.
### Sample test page CSS

The following two files aren't necessary for the project's components--they provide CSS for the sample/test pages that is independent of component testing. These files are not exported.

`+layout.svelte`

```
<script lang="ts">
	import '../style.css';

	let { children } = $props();
</script>

{@render children()}
```

`style.css`

```
body {
    font-family: sans-serif;
}
```

This is how the component looks in the `node_modules` folder of a consuming application:

![[image-66.png]]

Note there is no `src` directory (and therefore no routes and pages) in the imported package.
## Step 2. GitHub repo

Create a GitHub repo for the project. There isn't anything unique or special about this repo. 
## Step 3. Building a component

These steps are required for building the component.

```
pnpm run prepack
```

This step packages the project into the `.dist` folder. 

> [!important]
> Make sure your `.gitignore` file doesn't ignore the `.dist` folder. 

Then, use these steps to update the project and its tag at GitHub:

```
git add .
git commit -m "feat: add new components"
git push

git tag v0.0.6
git push origin v0.0.6
```

Use this command line to add update a consuming project (syntax varies on the package manager used)

```
pnpm add https://github.com/rogerpence/sv-utils#v0.0.6
```

## Using the component in a project

> [!info]
> Be sure to add or update a reference to your component!  

Add a reference to your component in a page or other Sveltekit compontent:

```ts
import { NextPrevAction, type NextPrevActionProps } from 'sv-components';
```

Then use it like any other SvelteKit component. 

There are two ways to use CSS offered by a custom SvelteKit component:
### 1. Within components

You can import the CSS with Vite/Sveltekit like this:

```ts
<script lang="ts">
	import { NextPrevAction, type NextPrevActionProps } from 'sv-components';

	import 'sv-components/css/next-prev-action/root.css';
	import 'sv-components/css/next-prev-action/utilities.css';
	import 'sv-components/css/next-prev-action/component.css';

	const totalPages = 21;
	const pageNumber = 1;
	const navRoute = '/technical-posts?pagenumber=';
</script>

<NextPrevAction {navRoute} {totalPages} {pageNumber}></NextPrevAction>
```
### 2. Import the CSS with CSS's `@import`

In a top level CSS file: 

The `lay(n)` is optional, but useful if your CSS uses layers.

```
@import "sv-components/css/next-prev-action/root.css" layer(global);
@import "sv-components/css/next-prev-action/utilities.css" layer(utilities);
@import "sv-components/css/next-prev-action/component.css" layer(components);
```

I prefer this method of including a component's CSS. This makes that CSS work right along with the application's CSS workflow. See vanilla CSS workflow for more on my preferred CSS workflow.

Your custom SvelteKit components should emit no, or very little, hardcoded CSS within the component file. They should emit markup only. They should provide some basic CSS as stand-alone CSS files (consumed as explained above) that a consuming application could use. However, you may choose to not use the CSS a component provides and write your own in your application.