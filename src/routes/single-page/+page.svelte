<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';

	let { data }: PageProps = $props();
	let index = $state(0);

	const indexParam = $derived(Number(page.url.searchParams.get('index')) + 1);

	const Content = $derived(data.content);
	// Optional: this will log in BOTH places depending on SSR/CSR
	//console.log('post from load:', data.post);
</script>

<div>
	<a href="/single-page?index={indexParam}">Next</a>
</div>

<div class="technical-doc">
	<div class="content-wrapper">
		<h1>{data.post.title}</h1>
		<Content></Content>
	</div>
</div>

<!-- <pre>
    {JSON.stringify(
		Object.fromEntries(Object.entries(data.module).map(([k, v]) => [k, typeof v])),
		null,
		2
	)}
</pre> -->
