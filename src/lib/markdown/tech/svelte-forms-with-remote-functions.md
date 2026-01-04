---
title: Svelte forms with remote functions are awesome!
description: This article explains how to use Svelte 5 forms with remote functions.
date_updated: 2025-12-30
date_created: 2025-02-02
date_published: 2026-01-03
pinned: false
tags:
  - svelte
  - forms
---
## Creating a form with Svelte 5 for use with a remote function

### Create a form schema  

You have an interesting option we'll discuss later if you locate the form schema in a separate module (as opposed to defining it in the form's remote function). I put mine under the `src/lib/types` folder but you can put your schemas anywhere. 

`src/lib/types/form1.schema.ts`

Form schema are defined with any standard schema compliant validation library (ie, Zod, Valibot, or Arktype). I'm using Zod in this example. Zod has a [rich set of schema definition options](https://zod.dev/api). 

```ts
import { z } from 'zod';

export const form1Schema = z.object({
	title: z.string().nonempty({ message: "Hey, foo! Can't be empty" }),
	content: z.string().nonempty()
});
```

Using a schema is part of the magic of Svelte 5 forms. It provides:
- Strongly-typed, easy access to form fields
- The ability to populate a form with the correct tag and attributes for every field.
- Very effective form validation for the server- and client-side
- Freedom from third-party forms libraries like SuperForms. 
## Create a remote function

To reduce learning friction, this example Svelte 5 form remote function doesn't do very much, but it does enough to understand how things work. There aren't any rules as to where a  remote function must reside, but it anywhere you want. While it may be prudent to co-locate with them their corresponding `+page.svelte`, I like the idea of knowing where all my remote functions are located and put them in `src\lib\remote-funcs`.  

`src\lib\remote-funcs\form.remote.ts`

```
import { z } from 'zod';
import { form } from '$app/server';
import { error, redirect, invalid } from '@sveltejs/kit';
import { form1Schema } from '$lib/types/form1schema';

// You cannot export a schema from a remote function. Put them in a shared module.

export const createPost = form(form1Schema, async (data, issue) => {
	// Descructure the form fields from the data object.
	const { title, content } = data;

	// See a field value in the console.
	console.log(title);

	if (title == 'ROGER') {
		// use the issue object to throw custom error messages.
		invalid(issue.title('Title cannot be ROGER'), issue.content('Title cannot be PENCE'));
	}

	redirect(303, `/results`);
});
```

## Create a form 

Initially, the only unusual thing with the form declaration is its `<form>` tag. The `{...createPost}` populates the `type` and `action` attributes for you. In this case, the form fields were created manually. We'll see in a moment how the form schema helps with this.

```
<script lang="ts">
	import { createPost } from '$lib/remote-funcs/form.remote';
</script>

<form {...createPost}>
	<label>
		<h2>Title</h2>
		<input type="text" name="title" />	
	</label>

	<label>
		<h2>Write your post</h2>
		<textarea name="content" id="content"></textarea>		
	</label>

	<button type="submit">Submit</button>
</form>
```

For this example, Svelte5 rendered this  `<form>` tag

```
<form {...createPost}>
```

as 

```
<form method="POST" action="?/remote=1ig978e%2FcreatePost">
```

If you dig into the code Svelte 5 generates, you'll find that a remote function gets an alias assigned to it. For example, the remote function file provided above is assigned the `lig978e` alias. You won't ever know, or care, what this alias value is. 

```
init_remote_functions(m, "src/lib/remote-funcs/form.remote.ts", "1ig978e");
```

With this alias, and the function name (`createPost`, in this case) your form has the info it needs to issue the correct HTTP POST. 

An alternative manually creating the form fields yourself, is to use the schema and the spread operator to do the work for you:

```
<script lang="ts">
	import { createPost } from '$lib/remote-funcs/form.remote';
</script>

<form {...createPost}>
	<label>
		<h2>Title</h2>
		<input {...createPost.fields.title.as('text')} />
	</label>

	<label>
		<h2>Write your post</h2>
		<textarea {...createPost.fields.content.as('text')}></textarea>
	</label>

	<button type="submit">Submit</button>
</form>
```

Using the schema fields like this is mostly an easy way to populate the `name` attribute. This code:

```
<input {...createPost.fields.title.as('text')} />
```

Renders as:

```
<input name="title">
```

I think the point of using the more verbose spread is to ensure the form field names correspond to the schema field names. If you use the schema spread, you can also add other attributes to the tag (eg, `id` or `class`). 

preflight

error messages