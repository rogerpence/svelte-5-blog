---
title: Slots are deprecated
description: Slots are deprecated
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
[Joy of Code snippets video](https://www.youtube.com/watch?v=OlWWIbRz438)
Svelte 5 docs — [Multiple content placeholders](https://svelte.dev/docs/svelte/v5-migration-guide#Snippets-instead-of-slots-Multiple-content-placeholders)
`+layout.svelte`

Svelte 4

```
<slot></slot>
```

Slots are deprecated in Svelte 5; replaced with `@render`:

Svelte 5

```
<script lang="ts">
    let {children}  = $props();
</script>

<div class="wrapper">
    {@render children()}
</div>
```

Everything that came in through the `<slot></slot>` now comes in through the `children` property.