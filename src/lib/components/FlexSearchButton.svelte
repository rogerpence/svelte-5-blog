<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import SearchWorker from '$lib/scripts/search/flex-search-worker.ts?worker';
	import { StopWatch } from '$lib/scripts/global/stopwatch.ts';
	import { type SearchObject } from '$lib/scripts/search/flex-index-helpers';

	let searchStatus: 'idle' | 'load' | 'ready' = $state('idle');
	let searchTerm = $state('');
	let results: SearchObject[] = $state([]);

	let searchWorker: Worker | null = $state(null);

	// Resolves when the worker reports "ready"
	let readyPromise: Promise<void> | null = null;
	let resolveReady: (() => void) | null = null;

	let popoverElement: HTMLDivElement | null = null;
	let searchInputElement: HTMLInputElement | null = null;

	const sw = new StopWatch('create FlexSearch index');

	const hideResultsPopover = () => {
		(popoverElement as any)?.hidePopover?.();
	};

	// function onResultsClick(e: MouseEvent) {
	// 	const el = e.target as Element | null;
	// 	if (!el?.closest?.('a[href]')) return; // only close when an actual link is clicked
	// 	hideResultsPopover();
	// }

	// Close the popover whenever we navigate away (route change)
	beforeNavigate(() => {
		hideResultsPopover();
	});

	const onWorkerMessage = (e: MessageEvent) => {
		const { type, payload } = e.data ?? {};

		if (type === 'ready') {
			searchStatus = 'ready';
			sw.stop();
			resolveReady?.();
			resolveReady = null;
			return;
		}

		if (type === 'results') {
			results = payload?.results ?? [];
			return;
		}

		if (type === 'worker_error') {
			console.error('Worker error:', payload);
			return;
		}
	};

	function startSearchEngine() {
		if (searchWorker) return;

		searchStatus = 'load';
		sw.start();

		searchWorker = new SearchWorker();
		searchWorker.addEventListener('message', onWorkerMessage);
		readyPromise = new Promise<void>((resolve) => (resolveReady = resolve));
		searchWorker.postMessage({ type: 'load' });
	}

	async function performSearch() {
		await tick();
		(popoverElement as any)?.showPopover?.();

		startSearchEngine();
		await readyPromise; // waits until worker posts { type: 'ready' }
		sw.showElapsedMS();
		searchInputElement?.focus();
	}

	$effect(() => {
		/*
		 | Search initiated here.
		 */
		// When search is ready and the search term changes send a
		// search message to the worker.

		if (searchStatus === 'ready') {
			searchWorker?.postMessage({ type: 'search_en', payload: { searchTerm } });
		}
	});

	onDestroy(() => {
		if (!searchWorker) return;
		searchWorker.removeEventListener('message', onWorkerMessage);
		searchWorker.terminate();
		searchWorker = null;

		readyPromise = null;
		resolveReady = null;

		hideResultsPopover();
	});
</script>

<button
	onclick={performSearch}
	disabled={searchStatus === 'load'}
	aria-label="search"
	aria-busy={searchStatus === 'load'}
>
	<svg width="24" height="24" fill="none" aria-hidden="true" class="mr-3 flex-none">
		<path
			d="m19 19-3.5-3.5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<circle
			cx="11"
			cy="11"
			r="6"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>Search...
	<span class="keystroke-container">
		<span class="keystroke">Ctrl</span> <span class="keystroke k">K</span>
	</span>
</button>
<!-- popovertarget="search-results"
	popovertargetaction="show">SEARCH</button -->

<!-- {#if results?.length}
	<ul>
		{#each results as result}
			<pre>{result.slug}</pre>
		{/each}
	</ul>
{/if} -->

<!-- {#if search === 'ready'} -->
<div bind:this={popoverElement} popover="auto" id="search-results" class="popover">
	<div class="search">
		<input
			bind:this={searchInputElement}
			bind:value={searchTerm}
			placeholder="Search"
			autocomplete="off"
			spellcheck="false"
			type="search"
		/>

		<div class="results">
			{#if results}
				<ul>
					{#each results as result, index}
						<li>
							<div>
								<div>
									{#if result?.slug}
										<a href="/{result.slug}" onclick={hideResultsPopover}>
											{@html result.title}
										</a>
									{:else}
										<span>{@html result.title}</span>
									{/if}
								</div>
								<div>
									{@html result.description}
								</div>
							</div>
							<!-- <div>
								{@html result.description}
							</div> -->
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>
