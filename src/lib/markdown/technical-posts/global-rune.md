---
title: global rune
description: global rune
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Okay, let's create a global reactive string using Svelte 5 runes and react to its changes in the root layout (`+layout.svelte`).

Svelte 5 runes (`$state`, `$effect`, etc.) need to be enabled in your `svelte.config.js`:

```javascript
// svelte.config.js
import adapter from "@sveltejs/adapter-auto"; // or your preferred adapter
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        // ... other kit options
    },

    // --- ADD THIS ---
    compilerOptions: {
        runes: true, // Enable runes mode
    },
    // --- END ADD ---
};

export default config;
```

**Important:** After changing `svelte.config.js`, **stop and restart** your development server (`npm run dev`).

Now, let's create the global store:

**1. Create the Global Store File (`src/lib/sharedStore.ts`)**

It's best practice to put shared, reusable state logic in the `src/lib` directory. We'll use TypeScript here for better type safety.

```typescript
// src/lib/sharedStore.ts
import { browser } from "$app/environment";

// Define the structure of our store's state
type SharedStore = {
    trackedString: string;
};

// Create the reactive state using $state
// Initialize with a default value
let store = $state<SharedStore>({
    trackedString: "Initial Value",
});

// Optional: Log when the store module is loaded
if (browser) {
    console.log("Shared store module loaded (client)");
} else {
    console.log("Shared store module loaded (server)");
}

// --- Export the reactive store object ---
// Components will import this 'sharedStore' object
// and access/modify its properties directly (e.g., sharedStore.trackedString)
export const sharedStore = store;

// --- Alternatively, you could export getter/setter functions ---
// This provides more control but is often less direct with runes
/*
export function getTrackedString(): string {
    return store.trackedString;
}

export function setTrackedString(newValue: string): void {
    console.log(`Setting trackedString from '${store.trackedString}' to '${newValue}'`);
    store.trackedString = newValue; // Direct assignment triggers reactivity
}
*/
```

**Explanation:**

-   **`$state<SharedStore>({...})`**: This is the core Svelte 5 rune for creating reactive state. We provide a type `SharedStore` and an initial object. Any property within this object (`trackedString`) becomes reactive.
-   **`export const sharedStore = store;`**: We export the entire reactive `store` object. This is the common pattern with runes – components directly interact with the properties of the exported state object.

**2. Modify the Rune in a Component or Page (Example: `src/routes/some-page/+page.svelte`)**

```svelte
<!-- src/routes/some-page/+page.svelte -->
<script lang="ts">
	import { sharedStore } from '$lib/sharedStore';

	// No need for 'let' or '$:' for reactivity when reading/writing rune state properties
	// The component automatically subscribes when 'sharedStore.trackedString' is used in the template

	function updateString() {
		// Directly modify the property on the imported store object
		sharedStore.trackedString = 'Updated from page at ' + new Date().toLocaleTimeString();
		console.log('Updated sharedStore.trackedString from page');
	}

	function appendToString() {
		sharedStore.trackedString += ' Appended!';
		console.log('Appended to sharedStore.trackedString from page');
	}
</script>

<h2>Page Example</h2>

<p>
	The current shared string is: <strong>{sharedStore.trackedString}</strong>
</p>

<button onclick={updateString}>Set New String Value</button>
<button onclick={appendToString}>Append to String</button>

<style>
	button { margin: 5px; }
</style>
```

**Explanation:**

-   **`import { sharedStore } from '$lib/sharedStore';`**: Import the reactive store object.
-   **`sharedStore.trackedString = ...`**: Directly assign a new value to the `trackedString` property. Because `sharedStore` was created with `$state`, Svelte automatically detects this change and updates any parts of the UI that depend on it.
-   **`{sharedStore.trackedString}`**: Reading the value in the template automatically makes this component reactive to changes in that specific property.

**3. React to Changes in the Root Layout (`src/routes/+layout.svelte`)**

Here, we use the `$effect` rune to run code whenever `sharedStore.trackedString` changes.

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { sharedStore } from '$lib/sharedStore';
	import { browser } from '$app/environment';

	// Use $effect to run side-effects when dependencies change
	$effect(() => {
		// Access the reactive property *inside* the effect
		// This tells Svelte that this effect depends on sharedStore.trackedString
		const currentStringValue = sharedStore.trackedString;

		// IMPORTANT: Avoid modifying the state you are tracking *within* the effect
		// unless you have specific logic (like debouncing) to prevent infinite loops.
		// Here, we are just *reacting*.

		if (browser) {
            // Perform actions only on the client-side if needed
			console.log(`%cLAYOUT EFFECT: trackedString changed to: "${currentStringValue}"`, 'color: blue; font-weight: bold;');

			// --- Firing a custom event (Example) ---
			// You might want to notify non-Svelte parts of your app,
            // or structure event handling this way.
			const event = new CustomEvent('sharedstringchanged', {
				detail: { newValue: currentStringValue }
			});
			window.dispatchEvent(event);
			console.log('LAYOUT EFFECT: Dispatched "sharedstringchanged" window event.');
		} else {
            // You could log on the server too if needed during SSR,
            // though UI side-effects usually happen client-side.
             console.log(`LAYOUT EFFECT (SSR): trackedString is: "${currentStringValue}"`);
        }

        // Optional: Cleanup function
        // This runs just before the effect re-runs, or when the component is unmounted.
        return () => {
            if (browser) {
                console.log(`LAYOUT EFFECT: Cleanup before re-run or unmount (previous value was "${currentStringValue}")`);
                // Example: remove event listeners added above if they were attached to specific elements
            }
        };
	});

    // You can still display the value directly in the layout too
</script>

<header style="background-color: #eee; padding: 10px; margin-bottom: 15px; border-bottom: 1px solid #ccc;">
	<h1>My App Layout</h1>
	<p>Layout sees shared string: <strong>{sharedStore.trackedString}</strong></p>
    <p><small>Check the browser console for effect logs and events when the string changes.</small></p>
    <nav>
        <a href="/">Home</a> |
        <a href="/some-page">Some Page (Changes String)</a>
        <!-- Add other navigation links -->
    </nav>
</header>

<main>
	<slot />
</main>

<footer>
	<!-- Footer content -->
</footer>
```

**Explanation:**

-   **`import { sharedStore } from '$lib/sharedStore';`**: Import the store.
-   **`$effect(() => { ... });`**: This rune registers a side effect.
-   **`const currentStringValue = sharedStore.trackedString;`**: Crucially, you _must read_ the reactive state property (`sharedStore.trackedString`) _inside_ the effect's callback function. This establishes the dependency. Svelte now knows to re-run this effect whenever `sharedStore.trackedString` changes.
-   **`if (browser)`**: Often, side effects like logging specific messages or dispatching DOM events are only relevant in the browser environment.
-   **`console.log(...)`**: Logs a message every time the effect runs (initially and on subsequent changes).
-   **`new CustomEvent(...)` / `window.dispatchEvent(...)`**: This demonstrates how to fire a standard DOM event when the value changes. Other parts of your application (even non-Svelte JavaScript) could listen for this `sharedstringchanged` event on the `window`.
-   **`return () => { ... }`**: The optional cleanup function returned by the effect runs before the effect re-runs due to a dependency change, or when the component instance is destroyed. It's useful for cleanup tasks like removing manually added event listeners or clearing timers.

Now, when you navigate to `/some-page` and click the buttons, `sharedStore.trackedString` will be updated. Svelte's reactivity system will:

1.  Update the displayed value in `/some-page/+page.svelte`.
2.  Update the displayed value in `/routes/+layout.svelte`.
3.  Trigger the `$effect` in `/routes/+layout.svelte`, causing it to log the message and dispatch the custom event.