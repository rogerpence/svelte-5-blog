---
title: Runes
description: Runes
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
These runes make Svelte 5 highly modular, giving developers more control over reactivity and lifecycle management. As Svelte 5 evolves, additional runes may be introduced or refined to further enhance flexibility and reactivity. Let me know if you’d like examples or additional details for any specific rune!

-   **`$all`**: Runs code only after all dependencies in a group have been resolved; useful for grouped asynchronous code.
-   **`$any`**: Triggers reactivity when any of the listed dependencies change, allowing for conditional updates.
-   **`$context`**: Allows for setting and getting context values between components, streamlining inter-component communication.
-   **`$derive`**: Creates computed properties derived from other values or stores, similar to `$memo` but geared toward properties that depend on external data.
-   **`$effect`**: Runs a function with side effects whenever dependencies change, useful for tasks like interacting with the DOM or calling external APIs.
-   **`$effectAsync`**: Handles asynchronous effects and reruns them as needed based on dependencies.
-   **`$memo`**: Caches the result of a computation and only recomputes it when dependencies change, enabling derived state functionality.
-   **`$onDestroy`**: Runs cleanup logic when a component is destroyed, like unsubscribing from stores or clearing timers.
-   **`$run`**: Runs a function and recalculates whenever reactive dependencies change, similar to the `$:` statement in Svelte 3.
-   **`$store`**: Provides a way to create reactive values within components, serving as a more granular alternative to Svelte's traditional stores.
-   **`$tick`**: Defers updates until the DOM has been updated, allowing for waiting until the next render cycle.

[Joy of Code video about using Runes globally -- very good info here](https://youtu.be/qI31XOrBuY0?t=1460)
[That video also shows an interesting use of $derived.by](https://youtu.be/qI31XOrBuY0?t=1597)
[Rich Harris's discussion on using Runes globally](https://youtu.be/NR8L5m73dtE?t=600)

[Load functions should be pure!](https://youtu.be/qI31XOrBuY0?t=1648)