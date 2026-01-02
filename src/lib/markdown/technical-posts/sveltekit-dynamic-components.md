---
title: Using dynamic components with SvelteKit
description: Using dynamic components with SvelteKit
date_created: '2025-06-26T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Of course! This is a classic and powerful pattern for building dynamic layouts, content management systems (CMS), or page builders. The best way to achieve this in SvelteKit 2.0 / Svelte 5 leverages two core features:

1.  **Dynamic Imports `import()`:** A standard JavaScript feature that allows you to load a module (like a Svelte component) on demand. Vite, the build tool behind SvelteKit, automatically code-splits any dynamically imported module, meaning it only gets downloaded by the user's browser when it's actually needed. This is excellent for performance.
2.  **Svelte's `<svelte:component>` element:** A special Svelte element that can render any component you pass to its `this` prop.

Here is the best practice, broken down into a step-by-step guide.


### The Goal

We want to render a sequence of components defined in a JSON file.

**Example `layout.json`:**
```json
[
  {
    "component": "Banner",
    "props": {
      "title": "Welcome to SvelteKit 2.0!",
      "subtitle": "Dynamic components made easy."
    }
  },
  {
    "component": "Profile",
    "props": {
      "name": "Alex Doe",
      "avatar": "/images/alex.jpg",
      "bio": "A passionate Svelte developer."
    }
  },
  {
    "component": "CallToAction",
    "props": {
      "buttonText": "Learn More"
    }
  }
]
```

### Step 1: Create Your Components

First, let's create the components that our JSON file refers to.

`src/lib/components/Banner.svelte`
```svelte
<script>
  export let title = '';
  export let subtitle = '';
</script>

<div class="banner">
  <h1>{title}</h1>
  <p>{subtitle}</p>
</div>

<style>
  .banner {
    background-color: #333;
    color: white;
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
  }
</style>
```

`src/lib/components/Profile.svelte`
```svelte
<script>
  export let name = '';
  export let avatar = '';
  export let bio = '';
</script>

<div class="profile">
  <img src={avatar} alt={name} />
  <h2>{name}</h2>
  <p>{bio}</p>
</div>

<style>
  .profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
</style>
```

`src/lib/components/CallToAction.svelte`
```svelte
<script>
  export let buttonText = 'Click Me';
</script>

<div class="cta">
  <button>{buttonText}</button>
</div>

<style>
  .cta { text-align: center; padding: 2rem; }
  button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
```

### Step 2: Create a Component Mapper

This is the crucial part. We need a way to map the string names from the JSON (`"Banner"`, `"Profile"`) to the actual component files. A simple JavaScript object is perfect for this.

**This file acts as a manifest for your dynamic components.**

`src/lib/componentMap.js`
```javascript
// A map of component names to their dynamic import functions.
// Using a function `() => import(...)` is key. It makes the import lazy,
// so the component code is only requested when this function is called.
export const componentMap = {
  Banner: () => import('$lib/components/Banner.svelte'),
  Profile: () => import('$lib/components/Profile.svelte'),
  CallToAction: () => import('$lib/components/CallToAction.svelte'),
};
```
> **Why use `$lib`?** The `$lib` alias in SvelteKit is a reliable way to reference files inside your `src/lib` directory, avoiding messy relative paths like `../../../`.

### Step 3: Render the Dynamic Layout in Your Page

Now, let's use this in a SvelteKit page. We will read the JSON, iterate over it, and for each item, dynamically import and render the correct component.

`src/routes/+page.svelte`
```svelte
<script>
  import { componentMap } from '$lib/componentMap.js';
  import layoutConfig from './layout.json'; // Directly import the static JSON
  import Loading from '$lib/components/Loading.svelte'; // A simple loading indicator
  import ComponentError from '$lib/components/ComponentError.svelte'; // An error fallback

  // If layoutConfig were from an API, you'd load it in +page.js and receive it via `export let data;`
</script>

<div class="page-container">
  {#each layoutConfig as block}
    <!-- Look up the component's dynamic import function from our map -->
    {@const componentImporter = componentMap[block.component]}

    {#if componentImporter}
      <!-- 
        The #await block is perfect for handling the Promise returned by import().
        It gracefully handles loading, resolved, and error states.
      -->
      {#await componentImporter()}
        <Loading />
      {:then module}
        <!-- 
          The resolved module has a `default` property which is the Svelte component itself.
          We pass this to <svelte:component> and spread the props from our JSON.
        -->
        <svelte:component this={module.default} {...block.props} />
      {:catch error}
        <ComponentError message={error.message} componentName={block.component} />
      {/await}
    {:else}
      <!-- Handle cases where the component name in the JSON is not in our map -->
      <ComponentError componentName={block.component} message="Component not found in map." />
    {/if}
  {/each}
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 800px;
    margin: 2rem auto;
  }
</style>
```

You'll need to create the `Loading` and `ComponentError` components for the best user experience.

`src/lib/components/Loading.svelte`
```svelte
<div class="loading">Loading component...</div>
<style>.loading { padding: 2rem; text-align: center; color: #888; }</style>
```

`src/lib/components/ComponentError.svelte`
```svelte
<script>
  export let componentName = 'Unknown';
  export let message = 'An error occurred.';
</script>
<div class="error">
  <strong>Error loading component: {componentName}</strong>
  <p>{message}</p>
</div>
<style>.error { padding: 2rem; background-color: #ffdddd; border: 1px solid red; color: #a00; border-radius: 8px; }</style>
```


### Alternative: Using SvelteKit's `load` Function

If your JSON comes from an external API or a CMS instead of a static file, the SvelteKit-idiomatic way is to fetch it in a `+page.js` or `+page.server.js` `load` function.

`src/routes/+page.js`
```javascript
export async function load({ fetch }) {
  // In a real app, this URL would be your CMS or API endpoint
  const response = await fetch('/api/page-layout'); // or a direct import for local files
  const layoutConfig = await response.json();

  return {
    layoutConfig
  };
}
```

Then your `+page.svelte` would change slightly:
```svelte
<script>
  // Data now comes from the load function
  export let data;

  import { componentMap } from '$lib/componentMap.js';
  import Loading from '$lib/components/Loading.svelte';
  import ComponentError from '$lib/components/ComponentError.svelte';
</script>

<!-- The rest of the template remains the same, just use data.layoutConfig -->
<div class="page-container">
  {#each data.layoutConfig as block}
    <!-- ... same #await block as before ... -->
  {/each}
</div>
```

### Summary of Why This is the "Best Way"

1.  **Performance & Code-Splitting:** Users only download the JavaScript and CSS for the components they actually see. If a component isn't listed in the JSON, its code is never sent to the browser.
2.  **Maintainability:** The `componentMap.js` file provides a single, clear index of all components available for dynamic rendering. This prevents you from having to write a giant `if/else` or `switch` statement.
3.  **Flexibility:** You can easily build complex, re-orderable pages driven by a CMS or any other data source without changing your Svelte code.
4.  **Robustness:** Using the `{#await}` block with `{:then}` and `{:catch}` provides built-in handling for loading and error states, making your application more resilient.
5.  **Svelte 5 & Future-Proof:** This pattern is fundamental and works perfectly with Svelte 5's new reactivity model (runes) because it relies on standard JavaScript (`import()`) and core Svelte features (`<svelte:component>`, `{#await}`).