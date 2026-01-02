---
title: svelte 5-2 changes
description: svelte 5-2 changes
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
## $app/state

https://svelte.dev/docs/kit/$app-state

```
import { navigating, page, updated } from '$app/state';
```

Note that `page` is no longer prefixed with $ in the code.

```
<script lang="ts">
	import { page } from '$app/state';
</script>

<p>Currently at {page.url.pathname}</p>
```