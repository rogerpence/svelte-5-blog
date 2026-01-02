---
title: Validating Sveltekit forms with Zod
description: Validating Sveltekit forms with Zod
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - forms
---
This code is from this project:

```
C:\Users\thumb\Documents\projects\svelte\forms-exercises-with-zod\src\routes\form-with-action\+page.svelte
```

The route is `/form-with-action`

## Define the form inputs with Zod

```
import { z } from 'zod';

export const userFormSchema = z.object({
    company: z
        .string({ required_error: 'Company is required' })
        .min(1, { message: 'Company is required' })
        .max(64, { message: 'Company must be less than 64 characters' })
        .trim(),
    country: z
        .string({ required_error: 'Country is required' })
        .min(1, { message: 'Country is required' })
        .max(64, { message: 'Country must be less than 64 characters' }),
    first_name: z
        .string({ required_error: 'First name is required' })
        .min(1, { message: 'First name must be at least 6 characters' })
        .max(32, { message: 'First name must be less than 32 characters' })
        .trim(),
    last_name: z
        .string({ required_error: 'Last name is required' })
        .min(1, { message: 'Last name must be at least 6 characters' })
        .max(32, { message: 'Last name must be less than 32 characters' })
        .trim(),
    email: z
        .string({ required_error: 'Email is required' })
        .min(1, { message: 'Email is required' })
        .max(64, { message: 'Email must be less than 64 characters' })
        .email({ message: 'Email must be a valid email address' }),
    permission: z.enum(['on'], { required_error: 'You must accept the terms and conditions' })
});
```

## The form

```
    <form method="POST" action="?/create">
        <label>
            Company
            <input name="company" type="text" value={form?.data?.company ?? ''} />
            <div class="error">{form?.errors?.company[0]}</div>
        </label>
        ...
        <div>
            <input
                id="roger"
                name="permission"
                type="checkbox"
                checked={form?.data?.permission == 'on'}
            />
            <span
                >You have my permission to log the information above with this product request.
                Someone may contact you from ASNA to verify your use of the product.</span
            >
        </div>
        <button type="submit">Log in</button>
```

## The form action

```js
import { z } from 'zod';

import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { userFormSchema as userSchema } from '$lib/form-schema/userFormSchema.ts';

export const load: PageServerLoad = async ({ cookies }) => {
	// This where data would be sent to the page for its first display (ie, get the
	// data being edited.)
	return {};
};

export const actions: Actions = {
	create: async (event) => {
		//const formData = await event.request.formData();
		const formData = Object.fromEntries(await event.request.formData());
		console.log('formData', formData);
		// console.log('zod', userSchema)

		try {
			const result = userSchema.parse(formData);
			console.log('SUCCESS');
			console.log('result', result);
		} catch (err: any) {
			//  console.log('err', err.flatten())
			const { fieldErrors: errors } = err.flatten();
			//const { password, passwordConfirm, ...rest } = formData;
			const { ...rest } = formData;
			return {
				data: rest,
				errors
			};
		}

		return { success: true };
	}
};

```