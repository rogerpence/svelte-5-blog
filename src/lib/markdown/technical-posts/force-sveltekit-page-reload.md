---
title: Force Sveltekit page reloadO
description: Force Sveltekit page reloadO
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
By default, SvelteKit handles loading a page for a link, which may use a cached instance of the page instead of physically reloading the page. This is great for performance but sometimes you need to do achieve a programmatic hard-reload for a link (maybe to cause other logic imposed by query string values).

To force Sveltekit to reload a page, add `data-sveltekit-reload` to the link:

```
<a href="/myurl?email=bob@tom.com" data-sveltekit-reload>My link/a>
```

[Other powerful link options are explained here.](https://kit.svelte.dev/docs/link-options)