---
title: Using Zod with forms
description: Using Zod with forms
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
This is a good link to how to use Zod with JS Doc
https://blog.jim-nielsen.com/2023/types-in-jsdoc-with-zod/

I used it like this at the of a +page.svelte file that has a form:

I'm not sure it buys me anything!

```
<script>
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { z } from 'zod';

	const contactSchema = z.object({
		name: z.string().min(3),
		company: z.string().min(3),
		address: z.string().email(),
		sendupdates: z.boolean().default(false)
	});

	// Extract the inferred type as a JSDoc type
	/** @typedef { z.infer<typeof contactSchema> data } */

	export let data;

	const { form } = superForm(data.form);
</script>
```