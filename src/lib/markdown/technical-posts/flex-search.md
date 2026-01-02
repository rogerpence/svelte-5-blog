---
title: flex-search
description: FlexSearch in action
date_updated: 2025-12-23
date_created: 2025-02-02
date_published:
pinned: false
tags:
  - search
---

`search-worker.ts`

This Web worker creates and searches an index. 

```typescript
import { createIndex, searchIndex } from './search.ts';
import contents from '$lib/data/flex-search-input.json';
import type { Result } from './search.ts';

import { StopWatch } from '$lib/stopwatch.js';

// Listen for messages
addEventListener('message', async (e) => {
    const { type, payload } = e.data;
    console.log('type', type);

    if (type === 'load') {
        const sw = new StopWatch();
        sw.start();

        // Create search index.
        createIndex(contents);

        sw.elapsedMs('built index');

        // Tell requester FlexSearch is ready.
        postMessage({ type: 'ready' });
    }

    if (type === 'search_en') {
        const searchTerm = payload.searchTerm;

        // Search posts index.
        const results = searchIndex('en', searchTerm);

        // Send message with results and search term.
        postMessage({ type: 'results', payload: { results, searchTerm } });
    }

    if (type === 'search_es') {
        // Set search term.
        const searchTerm = payload.searchTerm;

        // Search posts index.
        const results = searchIndex('es', searchTerm);

        // const pageResults = results?.filter((result: Result) => result.isPage);
        // const postResults = results?.filter((result: Result) => !result.isPage);
        // const allResults = [...pageResults, ...postResults];

        // Send message with results and search term.
        postMessage({ type: 'results', payload: { results, searchTerm } });
    }
});
```

`SearchButton.svelte`

This Svelte component presents a pseudo search button with the logic to invoke a search.

```typescript
<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    //import { createPostsIndex, searchPostsIndex, type Result } from '$lib/search'
    import SearchWorker from '$lib/search-worker.ts?worker';

    import { type Result } from '$lib/search';

    import { StopWatch } from '$lib/stopwatch.js';

    let searchButton: HTMLButtonElement | null = null;

    // Svelete runes reactivity governs the search dialog behavior.
    let search: 'idle' | 'load' | 'ready' = $state('idle');
    let searchTerm = $state('');

    // The search results are displayed when results has at least one element.
    let results = $state([]);

    let searchWorker: Worker;
    let popoverElement: HTMLDivElement | null = null;

    interface ToggleEvent extends Event {
        newState: 'open' | 'closed';
        oldState: 'open' | 'closed';
    }

    function sortSearchResults() {
        if (results && results.length > 0) {
            results.sort((a: Result, b: Result) => {
                // Primary sort: isPage (true comes first)
                if (a.isPage !== b.isPage) {
                    return b.isPage ? 1 : -1; // Changed the logic here
                }
                // Secondary sort: title alphabetically
                return a.title.localeCompare(b.title);
            });
        }
    }

    /*
	 | Hardcoded for testing! Change for production.
	 */
    const locale: string = 'en';

    onMount(() => {
        // Create FlexSearch web worker.
        searchWorker = new SearchWorker();
        // Listen for messages from the worker.
        searchWorker.addEventListener('message', (e) => {
            const { type, payload } = e.data;
            // When worker is ready, set the search state to ready.
            if (type === 'ready') {
                search = 'ready';
            }
            // After worker creates search results get them.
            if (type === 'results') {
                results = payload.results;
                if (results) {
                    console.log($state.snapshot(results[0]));
                    sortSearchResults(results);
                }
            }
        });

        // Initialize the FlexSearch web worker when the component mounts.
        searchWorker.postMessage({ type: 'load' });

        popoverElement?.addEventListener('beforetoggle', (event: Event) => {
            if ((event as ToggleEvent).newState === 'open') {
                //document.body.setAttribute('inert', 'true')
                searchTerm = '';
            } else {
                //document.body.removeAttribute('inert')
            }
        });

        // The autofocus attribute causes issues with Sveltekit
        // accessibility rules. This is a workaround.
        popoverElement?.addEventListener('toggle', (event: Event) => {
            if ((event as ToggleEvent).newState === 'open') {
                popoverElement?.querySelector('input')?.focus();
            }
        });

        //console.log(popoverElement)
    });

    $effect(() => {
        /*
		 | Search initiated here.
		 */
        // When search is ready and the search term changes send a
        // search message to the worker.

        if (search === 'ready') {
            if (locale === 'en') {
                searchWorker.postMessage({ type: 'search_en', payload: { searchTerm } });
            } else {
                searchWorker.postMessage({ type: 'search_es', payload: { searchTerm } });
            }
        }
    });

    if (browser) {
        // Listen for the Ctrl + K key combination to open the search dialog.
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && (event.key === 'k' || event.key === 'K')) {
                event.preventDefault();
                searchButton?.click();
            }
        });
    }
</script>

<div class="search-button-container">
    <button
        type="button"
        class=""
        bind:this={searchButton}
        aria-label="search"
        popovertarget="search-results"
        popovertargetaction="show"
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
</div>

<!-- {#if search === 'ready'} -->
<div bind:this={popoverElement} popover="auto" id="search-results" class="popover">
    <div class="search">
        <input bind:value={searchTerm} placeholder="Search" autocomplete="off" spellcheck="false" type="search" />

        <div class="results">
            {#if results}
                <ul>
                    {#each results as result}
                        <li>
                            <!-- <div>path here</div> -->
                            <a href={result?.slug}>
                                {@html result?.title}
                                {result?.isPage}
                            </a>
                            <!-- <div class="search-result-tags">{@html result.tags}</div> -->
                            <div>
                                <a href={result?.slug}>
                                    {@html result.description}
                                </a>
                            </div>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
</div>

<!-- {/if} -->

<style>
    div.popover {
        background-color: transparent;
        border-radius: 15px;
        padding: 0;
        /* outline: 1px solid red; */
    }

    :global(body) {
        font-family: 'Manrope', sans-serif;
        font-size: 1.5rem;
        color: hsl(220 10% 98%);
        background-color: hsl(220 10% 10%);
    }

    :global(span.search-result-tag) {
        color: darkslategray;
        background-color: aqua;
        font-size: 0.9rem;
        padding: 4px 8px;
        border-radius: 0.4rem;
    }

    :global(.search-results-tags-wrapper) {
        margin-top: 0.6rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    :global(mark) {
        /* background-color: hsl(128 71.1% 82.4%);
		font */
        color: yellow;
        background-color: transparent;
        font-style: italic;
        /* color: hsl(220 10% 98%); */
        border-radius: 5px;
    }

    .search {
        width: 90vw;
        top: 6rem;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        max-width: 700px;
        border-radius: 0.5rem;
        box-shadow: 0px 0px 20px hsl(0 0% 0% / 40%);
        overflow: hidden;

        & input {
            width: 100%;
            padding: 1.5rem;
            color: hsl(220 10% 98%);
            background-color: hsl(220 10% 20%);
            font: inherit;
            border: none;
            outline: none;
        }
    }

    .results {
        max-height: 48vh;
        padding: 1.5rem;
        background-color: hsl(220 10% 14%);
        overflow-y: auto;
        scrollbar-width: thin;

        & ul {
            display: grid;
            gap: 1rem;
            padding: 0px;
            margin: 0px;
            list-style: none;

            & li p {
                color: silver;
                font-size: 1.2rem;
            }

            & li:not(:last-child) {
                padding-block: 0.5rem;
                border-bottom: 1px solid hsl(220 10% 20%);
            }
        }

        & a {
            display: block;
            font-size: 1.5rem;
            color: hsl(220 10% 80%);
            text-decoration: none;
            transition: color 0.3s ease;

            &:hover {
                color: aqua;
            }

            &:focus {
                outline: none;
                /* background-color: gray; */
                text-decoration: underline;
            }
        }
    }

    div.search-button-container {
        pointer-events: auto;

        & button {
            width: 15rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-radius: 5px;
            padding: 4px;
            color: #36454f;
            outline: none;
            cursor: pointer;

            & svg {
                margin-right: 2px;
            }

            & span.keystroke-container {
                margin-left: auto;
            }

            & span.keystroke {
                font-size: 0.9rem;
                /* border: 1px solid lightgray; */
                padding-inline: 4px;
                border-radius: 3px;
                background-color: #fff;
                outline: 1px solid gray;
            }

            & span.keystroke {
                padding-inline: 6px;
            }
        }

        & button:focus {
            box-shadow:
                rgba(204, 85, 0, 1) 0px 0px 0px 1px,
                rgb(209, 213, 219) 0px 0px 0px 1px inset;
        }
    }
</style>
```

`search.ts`

This TypeScript file displays search results.

```
import FlexSearch from 'flexsearch';

export type Content = {
    locale: string;
    content: string;
    slug: string;
    title: string;
    description: string;
    tags_list: string;
    isPage: boolean;
};

export type Result = {
    content: string[];
    slug: string;
    title: string;
    description?: string;
    tags_list?: string;
    isPage?: boolean;
};

let contentsIndex: FlexSearch.Index;
let contents: Content[];

/*
 * Create a Flex search index for the content.
 */
export function createIndex(data: Content[]) {
    contentsIndex = new FlexSearch.Index({ tokenize: 'forward' });

    data.forEach((post, i) => {
        // const item = `${post.title} ${post.content} ${post.description}`
        const item = `${post.content} ${post.description}`;
        contentsIndex.add(i, item);
    });

    contents = data;
}

function convertTagsListToHTMLString(tags: string): string {
    // Tags are indexed as a comma-separated string. This function converts that tags
    // string into an HTML string. Each tag is wrapped in a span element:
    // <span class="search-result-tag">${tag}</span>

    // The tags property of the indexing json files has already destructured the array
    // in a list.
    return `<span class="search-result-tag">${tags}</span>`;

    // const tagEach = tags.split(" ");

    // const tagHTMLString = tagEach.reduce((acc, tag) => {
    //     acc += `<span class="search-result-tag">${tag}</span>`;
    //     return acc;
    // }, "");

    // return tagHTMLString;
}

function dedupeByPropertyMap(arr: any, prop: string) {
    const uniqueMap = new Map();
    arr.forEach((obj: any) => {
        // We only set it if it's not already there, to keep the FIRST occurrence
        if (!uniqueMap.has(obj[prop])) {
            uniqueMap.set(obj[prop], obj);
        }
    });
    return Array.from(uniqueMap.values());
}

export function searchIndex(resultLocale: string, searchTerm: string) {
    if (searchTerm.trim().length === 0) {
        return;
    }
    const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const results = contentsIndex.search(match, { limit: 50 });

    if (searchTerm.length > 0 && results.length === 0) {
        return [
            {
                title: 'No results found.',
                content: ['Please try a different search term.'],
                slug: ''
            }
        ];
    }

    const searchResults = results
        .map((index) => contents[index as number])
        .filter((content) => content.locale === resultLocale)
        .map(({ slug, title, description, content, tags_list, isPage }) => {
            const tagHTMLString = convertTagsListToHTMLString(tags_list);

            const barPosition = title.indexOf('|');
            if (barPosition !== -1) {
                title = title.substring(0, barPosition);
            }

            return {
                slug,
                title: `${replaceTextWithMarker(title, match)}`,
                description: `${replaceTextWithMarker(description, match)}`,
                content: '',
                tags: `<span class="search-results-tags-wrapper">${tagHTMLString}</span>`,
                isPage
            };
        });

    //console.log("searchResults", searchResults);

    // Ensure only unique 'slug' entries are returned. 
    return dedupeByPropertyMap(searchResults, 'slug');
}

/*
 * Find each search term match and surround it with a <mark> tag.
 */
function replaceTextWithMarker(text: string, match: string) {
    // console.log("text", text);
    // console.log("match", match);

    const regex = new RegExp(match, 'gi');
    return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
}

/*
 * Substring each match.
 */
function getMatches(text: string, searchTerm: string, limit = 1) {
    const regex = new RegExp(searchTerm, 'gi');
    const indexes = [];
    let matches = 0;
    let match;

    while ((match = regex.exec(text)) !== null && matches < limit) {
        indexes.push(match.index);
        matches++;
    }

    if (indexes.length === 0) {
        return 'Search term appears only in the title.';
    }

    return indexes.map((index) => {
        const start = index - 20;
        const end = index + 120;
        const excerpt = text.substring(start, end).trim();
        return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
    });
}
```