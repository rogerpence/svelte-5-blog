---
title: sveltekit-async-form-handling
description: sveltekit-async-form-handling
date_created: 2025-05-25T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - forms
---
Beyond making a traditional round-trip form more snappy, `use:enhance` can be exploited to do interesting Ajax-like work. This document explains how the use:enhance callback function works. 

```js 
<script lang="ts">
    import { enhance, applyAction } from '$app/forms';

	function doWork() {
		...
	}
</script>

...

<form
	method="POST"
	action="?/updateItem"
	id={formId}
	use:enhance={() => {
		// This function is explained in detail below. 
		return async ({ result, formData }) => {
			if (result.type === 'success' && result.data?.updatedItem) {
				doWork(result.data.updatedItem);
			}
			await applyAction(result); // SvelteKit's default behavior
		};
	}}
>
	<input type="hidden" name="id" value={item.id} />
	<button type="submit">Update</button>
</form>
```

```ts
// This is the callback function passed to use:enhance
// It's executed when the form is about to be submitted.
// It can return an "update" function that SvelteKit will call
// AFTER the form submission (fetch request to the server action) is complete.
() => {
    // This "update" function is returned.
    // It will be called by SvelteKit after the server action responds.
    return async ({ result, formData }) => {
        // 'result': This object contains information about the outcome of the server action.
        //   - result.type: 'success', 'failure', 'redirect', 'error'
        //   - result.status: The HTTP status code from the server action.
        //   - result.data: Any data returned by the server action (e.g., the updated item, an error message).
        //                  This is what you return from your action in +page.server.js.
        //                  For example: return { success: true, updatedItem: { ... } }

        // 'formData': The FormData object that was submitted with the form.
        //             Useful if you need to access the submitted values on the client-side
        //             for the optimistic update, though often the `result.data` is preferred.

        // 1. Optimistic Update Logic:
        if (result.type === 'success' && result.data?.updatedItem) {
            // Check if the server action reported success.
            // AND check if the 'data' object returned by the action contains
            // a property named 'updatedItem'. The ?. is optional chaining.

            // If both conditions are true, it means the server successfully updated the item
            // and sent back the updated version of the item.

            optimisticUpdate(result.data.updatedItem);
            // This calls a **local Svelte component function** named `optimisticUpdate`.
            // You would define this function elsewhere in your <script> tag.
            // Its job is to update your local Svelte state (the `items` array in the example)
            // *immediately* with the `updatedItem` data from the server.
            // This makes the UI change *before* SvelteKit might re-run a `load` function
            // to fetch all items again. It makes the app feel faster.
        }

        // 2. Apply SvelteKit's Default Behavior for the Action Result:
        await applyAction(result);
        // 'applyAction' is a function provided by SvelteKit (specifically by `enhance`).
        // This is crucial! It tells SvelteKit to:
        //    - Update `$page.form` with `result.data` if the action was a 'success' or 'failure'.
        //      This is how form-specific error messages or success messages are typically displayed.
        //    - Update `$page.status` with `result.status`.
        //    - Handle redirects if `result.type` is 'redirect'.
        //    - Invalidate data from `load` functions if the action indicates it should
        //      (or by default, actions invalidate all data unless `invalidateAll: false` is specified).
        //      This would cause relevant `load` functions to re-run and fetch fresh data.

        // If you OMIT `await applyAction(result)`, then:
        //    - `$page.form` won't be updated with the action's result.
        //    - `load` functions might not re-run even if data changed on the server.
        //    - Redirects from the action won't happen.
    };
}
```

**In simpler terms:**

1.  **Before Submission (Outer Function):**
    *   When the user clicks "Update" on a row, `use:enhance` intercepts the form submission.
    *   The outer `() => { ... }` part of the code runs. Its only job here is to *return* the inner `async ({ result, formData }) => { ... }` function.

2.  **After Server Responds (Inner `async` Function):**
    *   SvelteKit sends the form data to your `?/updateItem` server action using `fetch`.
    *   Your server action processes the data, updates the database (or in-memory store), and returns a response (e.g., `{ success: true, updatedItem: ... }`).
    *   Once SvelteKit receives this response, it calls the inner `async` function you provided, passing in the `result` (containing the server's response) and the original `formData`.

3.  **Inside the Inner `async` Function:**
    *   **Optimistic Part:**
        *   It checks if the server said "Success!" and gave back the `updatedItem`.
        *   If yes, it *immediately* calls your `optimisticUpdate` function. This function (which you write) directly modifies your Svelte component's local `items` array. So, the user sees the row update on the screen instantly.
    *   **Standard SvelteKit Part:**
        *   `await applyAction(result)`: This then tells SvelteKit to do its normal post-action work: update special stores like `$page.form`, handle potential redirects, and trigger data re-fetching if necessary. Even though you did an optimistic update, `applyAction` ensures everything is consistent with the server's final state and handles things like server-side validation errors being displayed.

**Why is this `optimisticUpdate` beneficial?**

*   **Perceived Speed:** The UI updates immediately, making the application feel very responsive, even if the server takes a moment to process the request.
*   **Better User Experience:** Users get instant feedback that their action has likely succeeded.

**The `optimisticUpdate` function itself (defined in your Svelte component's `<script>` tag) would look something like this:**

```ts
<script lang="ts">
    // ... other imports and reactive variables like 'items' ...
    export let data;
    let items = data.items; // Assuming items is passed from load

    function optimisticUpdate(updatedItemFromServer) {
        items = items.map(item =>
            item.id === updatedItemFromServer.id ? { ...item, ...updatedItemFromServer } : item
        );
    }

    // ... rest of your component logic ...
</script>
```

This function finds the item in the local `items` array by its ID and replaces it with (or merges it with) the `updatedItemFromServer` data.