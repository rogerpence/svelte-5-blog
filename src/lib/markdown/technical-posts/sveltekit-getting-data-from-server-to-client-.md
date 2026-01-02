---
title: Sveltekit - getting data from server to client. This article discusses PageServerLoad versus explicit typing for load functions with +page.server and +page.svelte.
description: Sveltekit - getting data from server to client. This article discusses PageServerLoad versus explicit typing for load functions with +page.server and +page.svelte.
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
## The right way

> [!tip]
> Do this instead

When the `load` return typed explicitly:

+page.server.ts

```
export async function load(): Promise<{ todos: Custom.Todo[] }> {
    const todos: Custom.Todo[] = getTodos();
    console.log('todos', todos);
    return { todos };
}
```

> [!info]
> See [[Using TypeScript with Svelte]] for defining custom types like `Custom.Todo` (as above)

The `data` value in the corresponding `+page.svelte` is typed correctly.

![[Sveltekit - getting data from server to client -1.png|500]]

+page.svelte

```
<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>
```

## The wrong way

The docs say to type a `load` function in `+page.server.ts` as type `PageServerLoad`--as shown below:

> [!danger]
> Do not do this

+page.server.ts

```ts
import { getTodos } from "$lib/server/database";
import type { PageServerLoad } from "./$types";

export async function load(): Promise<PageServerLoad> {
    const todos: Custom.Todo[] = getTodos();
    console.log("todos", todos);
    return { todos };
}
```

However, that presents the TypeScript warning that `todos` isn't declared on type `PageServerLoad`. And, in the corresponding `+page.svelte` the incoming `data` isn't typed.

![[Sveltekit - getting data from server to client 2.png|500]]