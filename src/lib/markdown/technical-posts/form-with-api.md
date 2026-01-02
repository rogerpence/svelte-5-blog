---
title: form with api
description: form with api
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Yes, you can handle form submissions without using JavaScript by leveraging SvelteKit's built-in form actions. This allows you to handle form submissions on the server side and return the appropriate response to the client.

Here's how you can do it:

1. \*\*Update the form action in

+page.svelte

to use the SvelteKit form action:\*\*

```html
<script lang="ts">
    import type { PageData, ActionData } from "./$types";
    import { page } from "$app/stores";

    let { form }: { data: PageData; form: ActionData } = $props();
</script>

<!-- Rest of your form fields... -->

<div class="form-01-wrapper">
    <form method="POST" action="?/create">
        <label>
            Company <input name="company" type="text" value={form?.data?.company
            ?? ''}/> {#if form?.errors?.company}
            <div class="error">{form?.errors?.company[0]}</div>
            {/if}
        </label>
        <label>
            Country <input name="country" type="text" value={form?.data?.country
            ?? ''}/> {#if form?.errors?.country}
            <div class="error">{form?.errors?.country[0]}</div>
            {/if}
        </label>
        <label>
            First name <input name="first_name" type="text"
            value={form?.data?.first_name ?? ''}/> {#if
            form?.errors?.first_name}
            <div class="error">{form?.errors?.first_name[0]}</div>
            {/if}
        </label>
        <label>
            Last name <input name="last_name" type="text"
            value={form?.data?.last_name ?? ''}/> {#if form?.errors?.last_name}
            <div class="error">{form?.errors?.last_name[0]}</div>
            {/if}
        </label>
        <label>
            Email address <input name="email" type="text"
            value={form?.data?.email ?? ''}/> {#if form?.errors?.email}
            <div class="error">{form?.errors?.email[0]}</div>
            {/if}
        </label>
        <div>
            <input
                id="roger"
                name="permission"
                type="checkbox"
                checked="{form?.data?.permission"
                ??
                false}
            />
            <span
                >You have my permission to log the information above with this
                product request. Someone may contact you from ASNA to verify
                your use of the product.</span
            >
        </div>
        <div class="button">
            <a href="/">Click me</a>
            <button type="submit">Log in</button>
        </div>
    </form>
</div>
```

2. **Update the server-side form action in `+page.server.ts` to handle the form submission:**

```typescript
import { fail } from "@sveltejs/kit";
import { z } from "zod";

const userSchema = z.object({
    company: z
        .string({ required_error: "Company is required" })
        .min(1, { message: "Company is required" })
        .max(64, { message: "Company must be less than 64 characters" })
        .trim(),
    country: z
        .string({ required_error: "Country is required" })
        .min(1, { message: "Country is required" })
        .max(64, { message: "Country must be less than 64 characters" }),
    first_name: z
        .string({ required_error: "First name is required" })
        .min(1, { message: "First name must be at least 6 characters" })
        .max(32, { message: "First name must be less than 32 characters" })
        .trim(),
    last_name: z
        .string({ required_error: "Last name is required" })
        .min(1, { message: "Last name must be at least 6 characters" })
        .max(32, { message: "Last name must be less than 32 characters" })
        .trim(),
    email: z
        .string({ required_error: "Email is required" })
        .min(1, { message: "Email is required" })
        .max(64, { message: "Email must be less than 64 characters" })
        .email({ message: "Email must be a valid email address" }),
    permission: z.enum(["on"], {
        required_error: "You must accept the terms and conditions",
    }),
});

export const actions = {
    create: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        console.log("formData", formData);

        try {
            const result = userSchema.parse(formData);
            console.log("SUCCESS");
            console.log("result", result);
            return { success: true };
        } catch (err) {
            const { fieldErrors: errors } = err.flatten();
            const { ...rest } = formData;
            return fail(400, { data: rest, errors });
        }
    },
};
```

3. **Ensure the form action is correctly referenced in the form:**

```svelte
<form method="POST" action="?/create">
```

By using SvelteKit's built-in form actions, you can handle form submissions without needing JavaScript on the client side. The form submission will be handled by the server, and the response will be returned to the client, allowing you to display any validation errors or success messages.

Similar code found with 1 license type

Yes, you can submit the form to an API endpoint without using JavaScript by leveraging SvelteKit's built-in form actions. This allows you to handle form submissions on the server side and return the appropriate response to the client.

Here's how you can do it:

1. **Create an API endpoint:**

Create a new file for your API endpoint, for example,

+server.ts

:

```typescript
import { json } from "@sveltejs/kit";
import { z } from "zod";

const userSchema = z.object({
    company: z
        .string({ required_error: "Company is required" })
        .min(1, { message: "Company is required" })
        .max(64, { message: "Company must be less than 64 characters" })
        .trim(),
    country: z
        .string({ required_error: "Country is required" })
        .min(1, { message: "Country is required" })
        .max(64, { message: "Country must be less than 64 characters" }),
    first_name: z
        .string({ required_error: "First name is required" })
        .min(1, { message: "First name must be at least 6 characters" })
        .max(32, { message: "First name must be less than 32 characters" })
        .trim(),
    last_name: z
        .string({ required_error: "Last name is required" })
        .min(1, { message: "Last name must be at least 6 characters" })
        .max(32, { message: "Last name must be less than 32 characters" })
        .trim(),
    email: z
        .string({ required_error: "Email is required" })
        .min(1, { message: "Email is required" })
        .max(64, { message: "Email must be less than 64 characters" })
        .email({ message: "Email must be a valid email address" }),
    permission: z.enum(["on"], {
        required_error: "You must accept the terms and conditions",
    }),
});

export const POST = async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    console.log("formData", formData);

    try {
        const result = userSchema.parse(formData);
        console.log("SUCCESS");
        console.log("result", result);
        return json({ success: true });
    } catch (err) {
        const { fieldErrors: errors } = err.flatten();
        const { ...rest } = formData;
        return json({ data: rest, errors }, { status: 400 });
    }
};
```

2. \*\*Update the form action in

+page.svelte

to point to the new API endpoint:\*\*

```js
<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { page } from '$app/stores';

    let { form }: { data: PageData, form: ActionData } = $props();
</script>

<!-- Rest of your form fields... -->

<div class="form-01-wrapper">
    <form method="POST" action="/api/create">
        <label>
            Company
            <input name="company" type="text" value={form?.data?.company ?? ''}/>
            {#if form?.errors?.company}
                <div class="error">{form?.errors?.company[0]}</div>
            {/if}
        </label>
        <label>
            Country
            <input name="country" type="text" value={form?.data?.country ?? ''}/>
            {#if form?.errors?.country}
                <div class="error">{form?.errors?.country[0]}</div>
            {/if}
        </label>
        <label>
            First name
            <input name="first_name" type="text" value={form?.data?.first_name ?? ''}/>
            {#if form?.errors?.first_name}
                <div class="error">{form?.errors?.first_name[0]}</div>
            {/if}
        </label>
        <label>
            Last name
            <input name="last_name" type="text" value={form?.data?.last_name ?? ''}/>
            {#if form?.errors?.last_name}
                <div class="error">{form?.errors?.last_name[0]}</div>
            {/if}
        </label>
        <label>
            Email address
            <input name="email" type="text" value={form?.data?.email ?? ''}/>
            {#if form?.errors?.email}
                <div class="error">{form?.errors?.email[0]}</div>
            {/if}
        </label>
        <div>
            <input id="roger" name="permission" type="checkbox" checked={form?.data?.permission ?? false}/>
            <span>You have my permission to log the information above with this product request. Someone may contact you from ASNA to verify your use of the product.</span>
        </div>
        <div class="button">
            <a href="/">Click me</a>
            <button type="submit">Log in</button>
        </div>
    </form>
</div>
```

By using the `method="POST"` and `action="/api/create"` attributes in the form, the form submission will be handled by the server-side API endpoint without requiring JavaScript on the client side. The server will process the form data and return the appropriate response, which will be rendered by the client.

Similar code found with 1 license type