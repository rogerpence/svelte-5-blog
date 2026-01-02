<script lang="ts">
	import 'rp-utils/console';
	import { getPosts } from '$lib/remote-funcs/tech-posts.remote';
	import type { TechnicalNoteFrontmatter } from '$lib/types/app-types';

	import { type MarkdownDocument } from 'rp-utils';
	import type { types } from 'util';

	const data: MarkdownDocument<TechnicalNoteFrontmatter>[] = await getPosts();
</script>

<h1>MDSVEX project</h1>

{#each data as obj}
	<pre>{obj.markdownObject.frontMatter.title}</pre>
{/each}

<!-- <svelte:boundary>
	{#await getPosts()}
		<p>Loading users...</p>
	{:then data}
		<ul>
			{#each data.users as user}
				<li>{user.firstName}</li>
			{/each}
		</ul>
	{:catch error}
		<p>Error loading users: {error.message}</p>
	{/await}
</svelte:boundary> -->
