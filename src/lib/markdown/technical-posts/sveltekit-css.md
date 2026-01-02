---
title: How to apply global CSS to a SvelteKit app.
description: How to apply global CSS to a SvelteKit app.
date_created: 2025-05-25T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - css
  - svelte
---
```html
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// CSS should be in the root of the SvelteKit app. 
	import '../pico.css'; // import global CSS

	let { children } = $props();
</script>

<div class="layout-container">
	<main>
		{@render children()}
	</main>
</div>
```