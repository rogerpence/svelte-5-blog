---
title: asna-com-svelte-upgrade
description: asna-com-svelte-upgrade
date_created: '2025-09-02T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - asna-com
---
src/components/contact-form/ContactForm.svelte
src/routes/downloads/[[slug]]/+page.svelte:


  ```
  // ...existing code...
<input
    name="country"
    id="country"
    type="text"
    list="all-tags"
    on:change={(e) => e.target.blur()}
    onfocus="this.value=''"
    title="If country not in list please type it in"
    required=true
    bind:value={form.country}
/>
// ...existing code.
```

```
// ...existing code...
<input
    name="country"
    id="country"
    type="text"
    list="all-tags"
    on:change={(e) => e.target.blur()}
    on:focus={(e) => e.target.value = ''}
    title="If country not in list please type it in"
    required=true
    bind:value={form.country}
/>
```

```
look at line 512 of downloads/[[slug]].+page.svelte

on:click|preventDefault|stopPropagation={modalDialog.closeModal()}>Cancel</a
```