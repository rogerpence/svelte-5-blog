---
title: Sveltekit ActionData for forms processing
description: Sveltekit ActionData for forms processing
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - forms
---
In SvelteKit, `form` is a special prop that contains form submission data and is automatically populated when using SvelteKit's form actions. Here's a breakdown:

1. **Type Definition**:

```typescript
export let form: ActionData;
```

-   This declares `form` as a prop with type `ActionData` (imported from `./$types`)
-   `ActionData` typically contains the return data from your form actions

2. **Usage Context**:

-   When you submit a form using SvelteKit's form actions (using `<form method="POST">`)
-   The `form` prop automatically receives the data returned by your action handlers
-   It persists across page loads/navigation
-   Useful for showing form submission results, errors, or success messages

Here's a typical example of how it might be used:

```svelte
<script lang="ts">
    import type { ActionData } from './$types';
    export let form: ActionData;
</script>

<form method="POST">
    <input name="username" />
    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}
    <button type="submit">Submit</button>
</form>
```

The commented-out `getPermissionState` function in your code suggests this form might be handling some kind of permission toggle, where the form data would include a permission field.

To see what data you're actually getting, you can check the console output from your `console.log('form data in page', form);` statement.