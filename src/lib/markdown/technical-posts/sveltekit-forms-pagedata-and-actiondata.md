---
title: Sveltekit forms - PageData and ActionData
description: Sveltekit forms - PageData and ActionData
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - forms
---
This code shows how to get data to and from a form.

This page provides the form and shows how to declare and use the `data : PageData` (initial data to the page) and `form : ActionData` (form data back to server) as well as show Zod-caught errors.

_+page.svelte_

```
<script lang="ts">
    import type { PageData, ActionData } from './$types';

    export let data: PageData | null | undefined = null;   // initial data to the page
    export let form: ActionData | null | undefined = null; // data from the form
</script>

<div class="form-01-wrapper">
    <form method="POST" action="?/create">
        <label>
            Company
            <input
                name="company"
                type="text"
                value={form?.data?.company ?? data?.formData?.first_name ?? ''}
            />
            <div class="error">{form?.errors?.company?.[0] ?? ''}</div>
        </label>
        <label>
            First name
            <input
                name="first_name"
                type="text"
                value={form?.data?.first_name ?? data?.formData?.first_name ?? ''}
            />
            <div class="error">{form?.errors?.first_name?.[0] ?? ''}</div>
        </label>
        <label>
            Last name
            <input
                name="last_name"
                type="text"
                value={form?.data?.last_name ?? data?.formData?.last_name ?? ''}
            />
            <div class="error">{form?.errors?.last_name?.[0] ?? ''}</div>
        </label>
        <label>
            Email address
            <input
                name="email"
                type="text"
                value={form?.data?.email ?? data?.formData?.email ?? ''}
            />
            <div class="error">{form?.errors?.email?.[0] ?? ''}</div>
        </label>
        <button type="submit">Log in</button>
    </form>
</div>

```

This example uses Zod to validate the form. Zod is so unintrusive and works on the client and server, that's it crazy to not use it to validate form input.

This example sends a very basic object to the page as the initial data through the `load` function. In cases where the form isn't a CRUD form but a sign-up form, it's not necessary to use a `load` function. It's included here for completeness. In a production CRUD app, the `load` function would fetch data from a persistent store to initially populate the form.

_+page.server.ts_

```
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { gotoRegistrantFormSchema as formSchema } from '$lib/form-schema/gotoRegistrantFormSchema';

// Initial page load.
export const load: PageServerLoad = async ({ cookies }) => {
    let formData = {
        company: 'Company Name',
        first_name: 'First Name',
        last_name: 'Last Name',
        email: 'Email Address'
    };

    return { formData};
};

// The form pages posts to this action.
export const actions: Actions = {
    create: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());

        try {
	        // Have Zod validate the form with its schema.
            const result = formSchema.parse(formData);

			// Redirect here on success.
        } catch (err: any) {
	        // Fetch the Zod errors:
            const { fieldErrors: errors } = err.flatten();

            return {
                data: formData,
                errors
            };
        }

		// I don't think action should ever get here.
        return { success: true };
    }
};
```

In a production app, the `create` action should provide a redirect to navigate the user to the next page.

The `gotoRegistrantFormSchema.ts` file define the form inputs for Zod.

Zod-related videos:

-   [Learn Zod In 30 Minutes](https://www.youtube.com/watch?v=L6BE-U3oy80&pp=ygUXdmFsaWRhdGUgZm9ybXMgd2l0aCB6b2TSBwkJhQkBhyohjO8%3D "Learn Zod In 30 Minutes")
-   [SvelteKit Form Validation with Zod](https://www.youtube.com/watch?v=3PYdcm-HBiw&t=743s&pp=ygUXdmFsaWRhdGUgZm9ybXMgd2l0aCB6b2Q%3D "SvelteKit Form Validation with Zod")
-   [Zod Makes TypeScript Even Better](https://www.youtube.com/watch?v=9UVPk0Ulm6U&pp=ygUXdmFsaWRhdGUgZm9ybXMgd2l0aCB6b2Q%3D "Zod Makes TypeScript Even Better")
-   [SvelteKit Form Validation with Zod](https://www.youtube.com/watch?v=11AbCRomRhs&pp=ygUXdmFsaWRhdGUgZm9ybXMgd2l0aCB6b2Q%3D "SvelteKit Form Validation with Zod")

_gotoRegistrantFormSchema.ts_

```
import { z } from 'zod';

export const gotoRegistrantFormSchema = z.object({
    company: z
        .string({ required_error: 'Company is required' })
        .min(1, { message: 'Company is required' })
        .max(64, { message: 'Company must be less than 64 characters' })
        .trim(),
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

## A note on the CSS (or lack thereof!)

No CSS is required to inhibit the display of errors if an error isn't present. If an error isn't present, the HTML rendered is:

```
<div class="error></div>
```

which intrinsically doesn't render anything. There is no need for CSS like this:

```
div.error:empty {
	display: none;
}
```