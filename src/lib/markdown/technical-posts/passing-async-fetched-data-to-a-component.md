---
title: Passing async-fetched data to a component
description: Passing async-fetched data to a component
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
This fixes the issue I had passing async-fetched to a component.

```
<script>

    // @ts-nocheck

    import { onMount } from 'svelte';
    import {get_release_set} from '$lib/data-repo.js'
    import FilenameCompare2 from './FilenameCompare2.svelte';
    import { writable } from 'svelte/store';

    let release_set_rows = []
    let prev_release_set_rows= []
    let prev_rows_store = writable([]);

    async function get_data(family_id, release_date,prev_family_id, prev_release_date) {
        release_set_rows = await get_release_set(family_id, release_date)

        const prev_release_set_rows = await get_release_set(prev_family_id, prev_release_date)
        //console.log('prev_release_set_rows', prev_release_set_rows)

        const rows = [...prev_release_set_rows.reduce((acc, row) => {
            acc.push({id: row.id,
                    family_id: row.family_id,
                    release_date: row.release_date,
                    product_id: row.product_id,
                    binary_file: row.binary_filename,
                    readme_file: row.readme_filename})
            return acc
        }, [])]

        $prev_rows_store = rows
        // alternatively:
        //prev_rows_store.set(rows);
    }

    async function button_one() {
        await get_data(132, '2024-08-04', 132, '2024-07-17')
    }

    async function button_two() {
        await get_data(139, '2024-05-09', 139, '2024-03-25')
    }

    </script>

    <h1>Test Page</h1>

    <button on:click={button_one}>ONE</button> | <button on:click={button_two}>TWO</button>

    {#each release_set_rows as row, index (row.product_id)}
        {row.id} {row.product_name} {row.binary_filename ?? ''}<br>
        <FilenameCompare2 filetype="binary" filename={row.binary_filename ?? ''} product_id={row.product_id} prev_rows_store={prev_rows_store} ></FilenameCompare2>
        <hr>
    {/each}

```

```
<script>
	import YesNoColumn from "$lib/components/YesNoColumn.svelte";
    import { onMount } from 'svelte';
    import FilenameCompare2 from './FilenameCompare2.svelte';
    import { get } from 'svelte/store';

    //export let export_rows
    export let filename
    export let filetype = 'binary'
    export let product_id
    export let prev_rows_store

    let prev_filename = ''

    function show_rows(prev_rows) {
        const prev_row = prev_rows.find(row => row.product_id == product_id)
        if (prev_row == undefined) {
            return ''
        }

        if (filetype != 'binary' ) {
            return prev_row.readme_file ?? ''
        }

        return prev_row.binary_file ?? ''
    }

    // This is weird and I hope runes makes it better.
    // this is like a change event that is raised when the
    // prev_rows_store changes. In this case, the parent
    // component is changes.
    $: {
        // if prev_filename is empty:
        //   no change
        // if prev_filename is not empty and prev_filename != filename
        //   file changed
        // else
        //   no change

        prev_filename = show_rows($prev_rows_store)
        // alternatively:
        // prev_rows_store.subscribe(row => {
        //     prev_filename = show_rows(row)
        // });
    }

    onMount( () => {
    })
</script>

<div>
    {prev_filename}
</div>

```