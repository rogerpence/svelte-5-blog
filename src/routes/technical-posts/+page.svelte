<script lang="ts">
	// import 'rp-utils/console';
	import { ZodError } from 'zod';
	import { page } from '$app/state';

	import { getTechPostsPage } from '$lib/remote-funcs/get-tech-posts-page.remote';

	import { type TechnicalNoteFrontmatter } from '$lib/types/app-types';
	import { NextPrevAction, type NextPrevActionProps } from 'sv-components';

	import { type PagerObj } from 'rp-utils';

	let error = $state<string | null>(null);
	let data = $state<PagerObj<TechnicalNoteFrontmatter> | null>(null);

	const nextPageNumber = $derived(data?.pageNumber ? data.pageNumber + 1 : 0);
	const prevPageNumber = $derived(data?.pageNumber ? data.pageNumber - 1 : 0);

	//let totalPages = 21;
	let curentPageNumber: number | undefined = $derived(data?.pageNumber);

	async function loadData(pageNum: number): Promise<void> {
		try {
			error = null;
			data = await getTechPostsPage({ pageNumber: pageNum });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load posts';
			console.error('Validation error:', err);
		}
	}

	$effect(() => {
		const pagenumber = Number(page.url.searchParams.get('pagenumber')) || 1;

		loadData(pagenumber);
	});

	// const totalPages = 21;
	// const pageNumber = 1;
	const navRoute = '/technical-posts?pagenumber=';

	// try {
	//   data = await getTechPostsPage({ pageNumber: pageNum });
	// } catch (err) {
	//   if (err instanceof ZodError) {
	//     error = err.errors.map(e => `${e.path}: ${e.message}`).join(', ');
	//   } else {
	//     error = 'Failed to load posts';
	//   }
	// }
</script>

<h1>MDSVEX project</h1>

{#each data?.pagedData as obj}
	{#if obj?.slug}
		<div><a href={obj.slug}>{obj.title}</a></div>
	{:else}
		<span>{obj.slug}</span>
	{/if}
{/each}

<NextPrevAction
	{navRoute}
	totalPages={data?.totalPages as number}
	pageNumber={curentPageNumber as number}
></NextPrevAction>

<!-- <div class="page-navigator-container bottom">
	{#if !data?.isFirstPage}
		<a href="/technical-posts?pagenumber={prevPageNumber}"
			><i class="icon previous-icon"></i> Previous</a
		>
	{/if}
	{#if !data?.isLastPage}
		<a href="/technical-posts?pagenumber={nextPageNumber}">Next <i class="icon next-icon"></i></a>
	{/if}
</div>
 -->
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
