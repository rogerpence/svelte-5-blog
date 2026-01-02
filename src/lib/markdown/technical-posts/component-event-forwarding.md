---
title: Company event fowarding
description: Company event fowarding
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
`CustomButton` component

```
<button on:click>
<slot/>
</button>
```

Parent:

```
<script>
	import CustomButton from './CustomButton.svelte';

	const clicker = (e) => {
		alert('hello')
	}
</script>

<CustomButton on:click={() => clicker()}>Click Me</CustomButton>
```

The component's click event is passed on to the parent's `clicker` handler.