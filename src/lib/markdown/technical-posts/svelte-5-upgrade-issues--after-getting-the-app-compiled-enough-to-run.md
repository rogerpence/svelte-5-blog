---
title: Svelte 5 upgrade issues --after getting the app compiled enough to run
description: Svelte 5 upgrade issues --after getting the app compiled enough to run
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
## Algolia

Algolia upgrade breaks search. Sent an email to support. See [[Algolia v5 upgrade]]

## Mark up changes

`en/products/wings` page failed because the `content.md` file had a caption element within a figure element for this image: \* https://nyc3.digitaloceanspaces.com/asna-assets/images/asna-com/wings-before-after.webp

> [!danger]
> Watch for mark up errors to cause bigger problems than you would expect. HTML don't care, but Svelte does!

## `svelte:component` deprecated

The `en/products/wings page` reads a `content.md` file for most of its content. With Svelte 4, the markdown was rendered with the `svelte:component` like this:

```
export let data;

</script>

<div>
	<svelte:component this={data.content} />
</div>
```

With Svelte 5, that changes to:

```
const { data } = $props();
const Markdown = data.content;

</script>

<div>
	<Markdown></Markdown>
</div>
```

The markdown is effectively treated like an on-the-fly component.

## `svelte.config.js` change

The orginal `svelte.config.js` file had the order the two preprocessors reversed (with `viteProcess()` coming first). Although the app worked that way, the Svelte 5 upgrade said mdsvex should come before `viteProcess()`, so I did change the order just for the superstitious value.

```
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],

```

## Zod forms validation

Zod's 2.x superValidate now needs a second argument that wraps the form schema in the `zod` function (which must be imported as show)

```
import { zod } from 'sveltekit-superforms/adapters';
```

The first arg to `superValidate` needs to be form data and the second needs to be the results of the `zod` call.

```
const formData = await event.request.formData();
const form = await superValidate(formData, zod(contactFormSchema));
```

This isn't right! That's only for form actions, not load functions. Watch for problems with `load` functions.