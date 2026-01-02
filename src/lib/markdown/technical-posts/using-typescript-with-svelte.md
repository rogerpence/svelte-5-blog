---
title: Using TypeScript with Svelte
description: Using TypeScript with Svelte
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
From [this page](https://svelte.dev/docs/kit/types) in Svelte docs:

## [app.d.ts](https://svelte.dev/docs/kit/types#app.d.ts)

The `src\app.d.ts` file is home to the ambient types of your apps, i.e. types that are available without explicitly importing them.

Always part of this file is the `App` namespace. This namespace contains several types that influence the shape of certain SvelteKit features you interact with.

```
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace Custom {
		interface Neil {
			name: string;
		}
		interface Young {
			name: string;
		}
	}
}

export {};
```

You can add your own namespaces under the `global` section and its types are instantly available with Intellisense.

![[Using TypeScript with Svelte.png|500]]