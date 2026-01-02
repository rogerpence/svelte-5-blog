---
title: Sveltekit layouts
description: Sveltekit layouts
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
You can include the [`<svelte:head>`](https://learn.svelte.dev/tutorial/svelte-head) special element when you need to add or change things in the HTML `<head>` section. This injects or replaces existing tags in the app.

```
<svelte:head>
    <title>My special title</title>
	...
</svelte:head>
```

> The docs say, "In server-side rendering (SSR) mode, contents of `<svelte:head>` are returned separately from the rest of your HTML." I'm not sure of the impact of this, but I think it means use this sparingly. Anything you know needs to be the `head` should be added to the `app.html` file.