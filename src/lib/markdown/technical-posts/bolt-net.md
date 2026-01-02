---
title: bolt.net
description: bolt.net
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
```
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Select Example</h1>

<form method="POST" use:enhance>
  <label for="option">Choose an option:</label>
  <select name="option" id="option">
    {#each data.options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  <button type="submit">Submit</button>
</form>

{#if data.selectedOption}
  <p>You selected: {data.selectedOption}</p>
{/if}

<style>
  form {
    margin-top: 20px;
  }
  label, select, button {
    margin-right: 10px;
  }
</style>
```

```
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  // This could be fetched from a database or API in a real application
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return {
    options,
    selectedOption: null
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const selectedOption = data.get('option');

    return {
      selectedOption
    };
  }
};
```