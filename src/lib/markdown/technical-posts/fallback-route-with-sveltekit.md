---
title: Create a Sveltekit fallback route
description: Create a Sveltekit fallback route
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
## Question to ChatGPT:

How can I provide a fallback route to a route not found in sveltekit

Note this part of the answer... seems helpful.

```js
if ($session.error) {
    // Redirect to a custom 404 page or any other fallback route
    // You can use the `goto` function to navigate programmatically
    goto("/custom-404-page");
}
```

### ChatGPT answer:

To provide a fallback route for a route not found in SvelteKit, you can use the `src/routes/__layout.svelte` file to catch and handle the not found routes. The `__layout.svelte` file acts as a layout component and is applied to all pages in your SvelteKit app.

Here's how you can implement a fallback route for handling page not found scenarios:

1. Create the `__layout.svelte` file if it doesn't exist in the `src/routes` directory.

2. Inside `__layout.svelte`, use the `slot` element to define the main content area of the layout:

```html
<!-- src/routes/__layout.svelte -->
<script>
    // You can have any layout-specific logic here
</script>

<main>
    <slot></slot>
</main>

<style>
    /* Add your layout styles here */
</style>
```

3. Now, in the `main` section of `__layout.svelte`, you can check for the existence of the current route using the SvelteKit's built-in `$session` store. If the route is not found (`$session.error` is defined), you can redirect the user to a custom 404 page or any other fallback route you want:

```html
<!-- src/routes/__layout.svelte -->
<script>
    import { onMount } from "svelte";

    onMount(() => {
        // This function will be called once the component is mounted
        if ($session.error) {
            // Redirect to a custom 404 page or any other fallback route
            // You can use the `goto` function to navigate programmatically
            goto("/custom-404-page");
        }
    });
</script>

<main>
    <slot></slot>
</main>

<style>
    /* Add your layout styles here */
</style>
```

4. Remember to create the custom 404 page or the fallback route in your `src/routes` directory, so when the user is redirected, they will see the fallback content.

That's it! Now, whenever a user navigates to a route that doesn't exist in your SvelteKit app, they will be redirected to the custom 404 page or any other fallback route you have defined.