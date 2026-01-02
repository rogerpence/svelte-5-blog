<script lang="ts">
	import type { PageProps } from './$types';

	// function fiddleWithContent(content) {

	// }

	let { data }: PageProps = $props();
	const Content = $derived(data.content);

	//	<h1>{data.meta.title}</h1>
	//Const
</script>

<div class="technical-doc">
	<div class="content-wrapper">
		<h1>{data.title}</h1>
		<Content />
	</div>
</div>

<style>
</style>
