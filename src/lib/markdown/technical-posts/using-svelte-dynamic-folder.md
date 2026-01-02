---
title: Using SvelteKit route matching
description: Using SvelteKit route matching
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
```.
└── case-study/
    └── [slug]/
        ├── +page.js
        └── +page.svelte
```

`+page.js`

Note how the `[slug]` route naming makes the `params.slug` value available.  

```js
import { error } from '@sveltejs/kit';

export const load = async ({ url, route, params }) => {
	const locale = route.id.slice(1, 3);

	try {
		const post = await import(`../../../markdown/case-study/${params.slug}.${locale}.md`);
		return {
			content: post.default,
			meta: post.metadata
		};
	} catch {
		throw error(404, `Could not find`);
	}
};
```

`+page.svelte`

```js
<script>
	import { page } from '$app/stores';
	import PageMetaData from '$components/all-locales/all-pages/PageMetaData.svelte';
	import TagLine from '$components/all-locales/all-pages/TagLine.svelte';
	import HeaderCaseStudy from '../../../../components/all-locales/all-pages/HeaderCaseStudy.svelte';

	//const locale = $page.url.pathname.slice(1, 3);
	//console.log(locale);

	export let data;
</script>


<PageMetaData pageData={data} /> 

<HeaderCaseStudy
	heading="ASNA Case Studies"
	subheading="Innovative products solving enterprise business challenges "
/>

<section class="asna-content">
	<h1>{data.meta.title}</h1>
    
	<article class="case-study">
        <svelte:component this={data.content} />
	</article>
    <TagLine {data} />
</section>

<style>
	h1 {
		font-size: 1.8rem;
	}
</style>
```