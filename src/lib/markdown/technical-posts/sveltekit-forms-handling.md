---
title: sveltekit-forms-handling
description: sveltekit-forms-handling
date_created: 2025-05-25T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - forms
---
## Define the form type and validation rules


* SimpleZodSchema 
* Simple
* SimpleFormData

```ts
import { z } from 'zod';

// All Zod fields are required by default -- but that means keys not values.
// For example, use min()/max() to mark a string field value as required.

export const SimpleZodSchema = z.object({
	id: z.string().optional(),
	description: z.string().min(5),
	location: z.string()
});

export type Simple = z.infer<typeof SimpleZodSchema>;

// This type is used for form data, where the 'id' field is not included.
// Omit others as needed.
export type SimpleFormData = Omit<Simple, 'id'>;
```

## page.server.ts

```ts
import { type Simple, SimpleZodSchema } from '$lib/types/Simple';
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const simple: Simple = {
		id: '1',
		description: 'This is a description',
		location: 'west'
	};

	return {
		simple
	};
};

export const actions: Actions = {
	update: async ({ locals, request, params }) => {
		const rawFormData = Object.fromEntries(await request.formData());

		console.log('rawFormData', rawFormData);

		try {
			const formData = SimpleZodSchema.parse(rawFormData) as Simple;

			const id = formData.id;
			const description = formData.description;
		} catch (err: any) {
			const { fieldErrors: errors } = err.flatten();

			return fail(400, {
				data: rawFormData,
				errors,
				message: ''
			});
		}

		// Redirect back to the list page after successful update
		//throw redirect(303, `/read?id=${id}`);
	}
};
```

## +page.svelte

```ts
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types'; // Use generated types
	import { type Simple } from '$lib/types/Simple';

	const { data, form } = $props<{
		data: PageData;
		form: ActionData | null;
	}>();

	// 'data' comes from the load function, and 'form' comes from the action.
	// On the page's initial load, 'form' is null. After a form submission, 'form' contains
	// the action result and data still has the initial data. The line below ensures that
	// we use the form data if available, otherwise we fall back to the initial data.

	const formData: Simple = form?.data ?? data.simple;
</script>

<svelte:head>
	<title>Simple Route</title>
</svelte:head>

<h1>Example Form</h1>

<div>
	{form?.message}
	{#if form?.errors?.general}<p class="error-message">{form.errors.general}</p>{/if}
</div>

<form method="POST" action="?/update">
	<div>
		<input type="hidden" name="id" id="id" value={formData.id} />

		<label for="description">Description:</label>
		<input type="text" id="description" name="description" value={formData.description ?? ''} />
		{#if form?.errors?.description}<p class="error-message">{form.errors.description}</p>{/if}

		<label for="location">Location:</label>
		<input type="text" id="location" name="location" value={formData.location ?? ''} />
		{#if form?.errors?.location}<p class="error-message">{form.errors.location}</p>{/if}
	</div>
	<button type="submit">Update Family</button>
</form>
```