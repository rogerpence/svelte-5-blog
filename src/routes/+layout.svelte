<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import MainNavBar from '$lib/components/MainNavBar.svelte';
	import '../style.css';

	let { children } = $props();

	function handleTestClick(id: string) {
		console.log(id);
	}
</script>

<svelte:head>
	<title>MDSVEX exmaple</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<MainNavBar onTestClick={handleTestClick}></MainNavBar>

<div>This is a sentence.</div>

{@render children?.()}
