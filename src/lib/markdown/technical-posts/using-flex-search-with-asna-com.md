---
title: Using Flex search with ASNA.com for its search engine
description: Using Flex search with ASNA.com for its search engine
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-23
date_published:
pinned: false
tags:
  - search
  - asna-com
---
## Creating Flex search input

There are two existing Json files that provide data to Algolia:

-   `src\lib\data\search-index.json`
-   `src\lib\data\search-index-pages.json`

> [!info]
> See the `src\lib\cmd-line\refresh-algolia-index.js` script for how it uses the Json files above. All of the files specified here are relative to the Project Ocho Sveltekit project root.

> [!revisit]
> Write a document that explains the difference between indexing markdown pages and HTML pages.

It was a little sloppy using these two Json files directly because a) they aren't shaped the same and and b) not all of the properties provided are necessary for search indexing.

[Flex](https://github.com/nextapps-de/flexsearch) is an in-memory search engine. The index is recreated, at runtime, on users' browsers. To try to reduce as much friction as possible for [Flex](https://github.com/nextapps-de/flexsearch) this Node script:

```
src\lib\cmd-line\create-flex-search-input.js
```

creates a Flex-specific input file (using the two Json files from above as input) named `src\lib\data\flex-search-input.json`. This Json contains only the properties needed for indexing (and therefore every object in this array has the same shape). Being one file, it also minimizes file activity for Flex indexing.

The shape of the Flex indexing object is:

```
{
	"locale": string;
	"content": string;
	"slug": string;
	"title": string;
	"description": string;
	"tags_list": string;
	"isPage": boolean;
},
```

> [!danger]
> For production use, I need to integrate this new Node script with Project Ocho's `full-deploy.ps1` script.


### readyPromise in the new code

`readyPromise` is a **one-time “gate”** that pauses `performSearch()` until the worker tells you it has finished building the index (i.e., it posts `{ type: 'ready' }`).

### How it works (step by step)

1. **When you start the worker**, you create a Promise and capture its resolver:

````ts
readyPromise = new Promise<void>((resolve) => (resolveReady = resolve));
````

- `readyPromise` is now a pending Promise.
- `resolveReady` is a function you can call later to **fulfill** that Promise.

2. **You send `load` to the worker**:

````ts
searchWorker.postMessage({ type: 'load' });
````

3. **When the worker finishes indexing**, it posts back `{ type: 'ready' }`.
   Your `onWorkerMessage` handler receives it and calls the resolver:

````ts
resolveReady?.();
resolveReady = null;
````

Calling `resolveReady()` transitions `readyPromise` from **pending → resolved**.

4. **`performSearch()` awaits that promise**:

````ts
await readyPromise;
````

- If the worker isn’t ready yet, execution pauses here.
- Once `resolveReady()` is called, the `await` continues and the code sends the search request.

### Why this is useful
It prevents a race where you might do:

- `postMessage('load')`
- immediately `postMessage('search_en')`

…before the index exists.

### Small gotcha to be aware of
TypeScript-wise, `readyPromise` can be `null`, but `performSearch()` does `await readyPromise`. In practice your code sets it before awaiting, but you can make it safer by ensuring it’s always defined (e.g., return the promise from `startSearchEngine()`), if you want stricter correctness.