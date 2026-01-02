---
title: svelte-reactivity-avoids-need-for-data-sveltekit-reload
description: svelte-reactivity-avoids-need-for-data-sveltekit-reload
date_created: '2025-10-26T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - svelte
---
A group of pages comprise 'success stories.' Each success story is rendered in 

```
src/routes/en/success-stories/[slug]+page.svelte
```

The right side of this page lists the currently available success stories. The list of available success stories is provided in this array" 

```
	export const successStories = [
		{ slug: 'aerospace-defense', title: 'Aerospace/Defense' },
		{ slug: 'healthcare-management', title: 'Health Care Management Services' },
		{ slug: 'health-medical', title: 'Health/Medical Care' },
		{ slug: 'financial-services', title: 'International Financial Services' },
		{ slug: 'marine-harbor-management', title: 'Marine Harbor Management' },
		{ slug: 'component-manufacturer', title: 'Micro Component Manufacturer' },
		{ slug: 'state-infrastructure', title: 'State Infrastructure Management' }
	];
```

This navigation lists is rendered as a unordered list. I wanted the currently-displayed success story's link to be marked as such in the list, like this: 

![[image-54.png|733x478]]

This code gets the current page's slug: 

```ts
import { page } from '$app/state';

...

let currentSlug = page.params.slug;
```

This loop renders the list of links, assigning the `active` class to the current link and conditionally adds the `(this article)` text to the link.

```
<ul>
	{#each successStories as story}
		<li class={currentSlug === story.slug ? 'active' : ''}>
			<a class="default-anchor" href="/en/success-stories/{story.slug}">
				{story.title}
				{#if currentSlug === story.slug}
					(this article)
				{/if}
			</a>
		</li>
	{/each}
</ul>
```

On the first display of the page, this works like a champ. However, when 


Great! Let me explain why this works in detail:

## How Svelte 5 Reactivity Works with `$derived`

### The Problem Before:
When you were using:
```javascript
let currentSlug = page.params.slug;
```

This created a **one-time assignment**. The variable `currentSlug` was set when the component first loaded, but it didn't track changes to `page.params.slug`. When you clicked a link to navigate to a different success story, SvelteKit's client-side navigation would update the `page` object, but `currentSlug` remained stuck with its original value.

### The Solution with `$derived`:
```javascript
let currentSlug = $derived(page.params.slug);
```

The `$derived` rune creates a **reactive derived state**. Here's what happens:

1. **Dependency Tracking**: When you use `$derived`, Svelte 5 automatically tracks that `currentSlug` depends on `page.params.slug`.

2. **Automatic Re-evaluation**: Whenever `page.params.slug` changes (when you navigate to a different success story), Svelte automatically re-runs the `$derived` expression and updates `currentSlug`.

3. **DOM Updates**: Because `currentSlug` is used in your template to determine the `active` class:
   ```svelte
   <li class={currentSlug === story.slug ? 'active' : ''}>
   ```
   When `currentSlug` updates, Svelte re-evaluates this expression for each list item and updates the classes in the DOM.

### Why `$app/state` Matters:

In Svelte 5, `page` from `$app/state` is a **reactive state object**. This means:
- It's not just a regular JavaScript object
- It's designed to work with Svelte 5's reactivity system
- When properties change (like `page.params.slug`), any `$derived` values that depend on it automatically update

### The Flow:
1. User clicks link → `/en/success-stories/aerospace-defense`
2. SvelteKit updates `page.params.slug` to `'aerospace-defense'`
3. `$derived` detects the change and updates `currentSlug`
4. Template expressions using `currentSlug` re-evaluate
5. The new active list item gets the `'active'` class, the old one loses it
6. CSS styling updates to show the new active state

### Why `data-sveltekit-reload` Wasn't Needed:

With `data-sveltekit-reload`, you were forcing a full page reload, which:
- Re-ran all JavaScript
- Re-created the component from scratch
- Lost the benefits of SvelteKit's client-side navigation
- Was slower and less efficient

With `$derived`, the reactivity system handles updates efficiently without needing to reload anything!