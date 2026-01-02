---
title: Using FlexSearch with SvelteKit with a service worker
description: Using FlexSearch with SvelteKit with a service worker
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
---
rogerpence: what does the following line of javascript do:
type === 'ready' && (search = 'ready')

GitHub Copilot: Let me explain this line step by step:

1. This is a shorthand conditional expression using logical AND (&&)
2. It combines a comparison and an assignment
3. It works like this:
    - First evaluates `type === 'ready'`
    - If true, executes `search = 'ready'`
    - If false, stops evaluation

It's equivalent to this more verbose if statement:

```javascript
if (type === "ready") {
    search = "ready";
}
```

This pattern is common in reactive UI frameworks like Svelte for concise conditional state updates. The code checks if `type` equals 'ready' and if so, sets the `search` variable to 'ready'.

This is a terse way to write a conditional assignment, though some developers prefer the more explicit if statement for clarity.

rogerpence: When an HTML popover is displayed, the page behind it isn't inert

GitHub Copilot: Let's add an overlay and make the background inert when the popover is shown.

### Plan:

1. Add CSS for a backdrop overlay
2. Add JavaScript to handle showing/hiding overlay
3. Make background inert using `inert` attribute
4. Toggle these when popover shows/hides

````svelte
<script lang="ts">
// ...existing code...

// Add popover state management
let isPopoverOpen = $state(false)

onMount(() => {
    // Add popover event listeners
    const popover = document.getElementById('search-results')
    popover?.addEventListener('beforetoggle', (event: Event) => {
        const e = event as ToggleEvent
        isPopoverOpen = e.newState === 'open'
        document.body.toggleAttribute('inert', isPopoverOpen)
    })
})
// ...existing code...
</script>

<div class="search-button-container">
    {#if isPopoverOpen}
    <div class="backdrop"
         on:click={() => document.getElementById('search-results')?.hidePopover()}
    ></div>
    {/if}
    <!-- ...existing button code... -->
</div>

<style>
    .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998; /* Below popover */
    }

    :global([inert]) {
        pointer-events: none<script lang="ts">
// ...existing code...

// Add popover state management
let isPopoverOpen = $state(false)

onMount(() => {
    // Add popover event listeners
    const popover = document.getElementById('search-results')
    popover?.addEventListener('beforetoggle', (event: Event) => {
        const e = event as ToggleEvent
        isPopoverOpen = e.newState === 'open'
        document.body.toggleAttribute('inert', isPopoverOpen)
    })
})
// ...existing code...
</script>

<div class="search-button-container">
    {#if isPopoverOpen}
    <div class="backdrop"
         on:click={() => document.getElementById('search-results')?.hidePopover()}
    ></div>
    {/if}
    <!-- ...existing button code... -->
</div>

<style>
    .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998; /* Below popover */
    }

    :global([inert]) {
        pointer-events: none

rogerpence: how can I set the correct data type for the event varaible in line 38. The beforetoggle event is from the HTML popover api

GitHub Copilot: Let's add the correct type for the `beforetoggle` event in the event listener. The HTML Popover API's `ToggleEvent` needs to be defined as it's not included in the default TypeScript DOM types yet.

Here's how to add the type:

1. First, add the `ToggleEvent` interface at the top of the script
2. Then use it in the event listener

```svelte
<script lang="ts">
    // Add this interface near the top of your script
    interface ToggleEvent extends Event {
        newState: 'open' | 'closed';
        oldState: 'open' | 'closed';
    }

    // ...existing code...

    popoverElement?.addEventListener('beforetoggle', (event: ToggleEvent) => {
        if (event.newState === "open") {
            //document.body.setAttribute('inert', 'true')
            searchTerm = ''
        } else {
            //document.body.removeAttribute('inert')
        }
    })

    // ...existing code...
</script>
````

This defines the `ToggleEvent` interface with the properties specified in the HTML Popover API specification and properly types the event parameter.

rogerpence: that still cases the typescript error that no overload matches the call

GitHub Copilot: Let's solve this step by step:

1. Research the HTML Popover API spec
2. Create a more specific type for the event
3. Use type assertion to handle the DOM event

Here's the corrected code:

```typescript
// Update the interface definition
interface ToggleEvent {
    newState: "open" | "closed";
    oldState: "open" | "closed";
}

// Change the event listener
popoverElement?.addEventListener("beforetoggle", ((event: Event) => {
    const toggleEvent = event as unknown as { newState: "open" | "closed" };
    if (toggleEvent.newState === "open") {
        //document.body.setAttribute('inert', 'true')
        searchTerm = "";
    } else {
        //document.body.removeAttribute('inert')
    }
}) as EventListener);
```

This solution:

-   Creates a separate interface for the toggle properties
-   Uses type assertion to handle the DOM event type
-   Maintains type safety while working with the experimental Popover API

rogerpence: would this also be a good way to do that:

```
if ((event as unknown as { newState: 'open' | 'closed' }).newState === "open") {
```

GitHub Copilot: No, that's not the best approach. Here's a better step-by-step solution:

1. Create a proper type for the Popover API toggle event
2. Cast the event once at the start of the function
3. Use the typed variable throughout the function

```svelte
interface PopoverToggleEvent extends Event {
    newState: 'open' | 'closed';
    oldState: 'open' | 'closed';
}

// ...existing code...

popoverElement?.addEventListener('beforetoggle', (event: Event) => {
    const toggleEvent = event as PopoverToggleEvent;

    if (toggleEvent.newState === "open") {
        //document.body.setAttribute('inert', 'true')
        searchTerm = ''
    } else {
        //document.body.removeAttribute('inert')
    }
});
```

This is better because:

-   It's more type-safe
-   More readable
-   Reuses the type definition
-   Avoids inline type assertions

rogerpence: what do you think of this:

```
if ((event as ToggleEvent).newState === "open") {
```

GitHub Copilot: Let's plan a better approach for handling the Popover toggle event:

1. Cast event once at start of handler function
2. Use typed variable throughout
3. Keep code clean and maintainable

```svelte
popoverElement?.addEventListener('beforetoggle', (event: Event) => {
    const toggleEvent = event as ToggleEvent;

    if (toggleEvent.newState === "open") {
        searchTerm = ''
    } else {
        //document.body.removeAttribute('inert')
    }
});
```

This improves:

-   Type safety
-   Code readability
-   Reduces repeated type assertions
-   Follows TypeScript best practices

rogerpence: Explain how the service worker in search-worker.ts is used with the SearchButton.svelte component

GitHub Copilot: # Web Worker Integration in Search Functionality

The search-worker.ts file creates a Web Worker that handles search operations off the main thread, providing better performance for the search functionality in SearchButton.svelte. Here's how they work together:

## How the Web Worker Works

1. **Initialization**:

    - In SearchButton.svelte component the worker is created with `new SearchWorker()`
    - When SearchButton.svelte is mounted it sends a `load` message to initialize the worker--which rebuilds the index.

2. **Communication Flow**:

    ```
    SearchButton                         search-worker.ts
    ┌─────────────┐                     ┌─────────────────┐
    │ Create      │────────────────────▶│                 │
    │ Worker      │                     │                 │
    │             │ {type: 'load'}      │ Fetch data      │
    │             │────────────────────▶│ Create index    │
    │             │                     │                 │
    │ Set         │ {type: 'ready'}     │                 │
    │ search=ready│◀────────────────────│                 │
    │             │                     │                 │
    │ User types  │ {type: 'search',    │                 │
    │ searchTerm  │  payload: {         │ Process search  │
    │             │   searchTerm }}     │ with FlexSearch │
    │             │────────────────────▶│                 │
    │             │                     │                 │
    │ Update UI   │ {type: 'results',   │                 │
    │ with results│  payload: {         │                 │
    │             │   results,          │                 │
    │             │   searchTerm }}     │                 │
    │             │◀────────────────────│                 │
    └─────────────┘                     └─────────────────┘
    ```

3. **Key Interactions**:
    - Worker loads search data and creates index when receiving `load` message
    - Component listens for `ready` and `results` messages from worker
    - Search requests are triggered reactively when `searchTerm` changes

## Benefits of This Approach

-   **Performance**: Search operations run in a separate thread, preventing UI freezes
-   **Responsiveness**: UI remains interactive during complex search operations
-   **Separation of Concerns**: Search logic is isolated from UI rendering

This pattern is particularly effective for search implementations that might handle large datasets or complex search algorithms.


FlexSearch example

Search schema

```
export type Content = {
    locale: string;
    content: string;
    slug: string;
    title: string;
    description: string;
    tags_list: string;
    isPage: boolean;
};
```