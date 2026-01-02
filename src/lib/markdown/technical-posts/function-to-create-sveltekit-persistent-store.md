---
title: Svelte persistent store
description: Svelte persistent store
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
[This code is taken from this article.](https://webjeda.com/blog/svelte-persistent-stores)

I think this is obsolete with Svelte 5.

```
import { browser } from "$app/environment";
import { derived, readable, writable } from "svelte/store";

export const createPersistentStore = (name, initialValue) => {
  let store = writable(initialValue);
  if (!browser) return store; // required for sveltekit

  const storedValue = localStorage.getItem(name);
  const finalValue = storedValue ? JSON.parse(storedValue) : initialValue;

  store = writable(finalValue, () => {
    const unsubscribe = store.subscribe((value) => {
      localStorage.setItem(name, JSON.stringify(value));
    });
    return unsubscribe;
  });
  return store;
};

export const theme = createPersistentStore("theme", "light");
```