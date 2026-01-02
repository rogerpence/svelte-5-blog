---
title: Using Sveltekit ParamMatcher to constraint dynamic routes
description: Using Sveltekit ParamMatcher to constraint dynamic routes
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
---
> [!info]
> See [this page](https://svelte.dev/docs/kit/advanced-routing#Matching) for more info.

## ParamMatcher

```
// src/params/fastener.ts
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
  // This runs FIRST during route matching
  console.log(`Matcher 'fastener' checking param: ${param}`);
  return param === 'bolts' || param === 'nuts';
};
```

```
// src/routes/inventory/[type=fastener]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit'; // Optional: for explicit error handling if needed

// Define the server load function
export const load: PageServerLoad = async ({ params }) => {
    // This code only runs IF the ParamMatcher (fastener.ts) returned true
    // for the 'type' segment in the URL.

    // 'params.type' will *always* be either 'bolts' or 'nuts' here,
    // because the matcher guaranteed it before this function was called.
    const itemType = params.type;

    console.log(`Server load running for type: ${itemType}`);

    // You can now confidently use itemType to fetch specific data
    let description = '';
    let stockLevel = 0;

    if (itemType === 'bolts') {
        // Fetch data specifically for bolts from a DB or API
        description = "Strong metal bolts for construction.";
        stockLevel = 1500;
    } else if (itemType === 'nuts') {
        // Fetch data specifically for nuts
        description = "Hex nuts to pair with bolts.";
        stockLevel = 2300;
    } else {
        // This 'else' block is technically unreachable because the matcher
        // prevents other values, but it's good practice for type safety
        // or if the matcher logic were to change.
        // You could throw an error here if needed, though SvelteKit's
        // routing would typically prevent this code path.
        console.error("Unexpected itemType in server load:", itemType);
        // throw error(404, 'Not Found'); // Or a 500 Internal Server Error
    }

    // Return the data to be used in the +page.svelte component
    return {
        item: {
            type: itemType,
            description: description,
            stock: stockLevel
        }
    };
};
```

```
src/
├── params/
│   └── fastener.ts       <-- PARAM MATCHER CODE IS HERE
│
├── routes/
│   └── inventory/
│       └── [type=fastener]/  <-- This part of the path LINKS the route to the matcher
│           │
│           ├── +page.server.ts  <-- THE LOAD FUNCTION CODE IS HERE
│           │
│           └── +page.svelte     <-- Your page component
│
└── app.html
└── ... (other files like hooks.server.ts, etc.)
```

To clarify the roles:

1.  **`ParamMatcher` (`src/params/fastener.ts`)**: This code defines _how to validate_ a specific URL parameter _during the routing phase_. It determines _if_ a request matches the route _before_ any data loading happens. Its code lives in the `src/params/` directory.
2.  **`+page.server.ts` `load` function**: This code runs _after_ SvelteKit has successfully matched the incoming request URL to the route (including passing any `ParamMatcher` checks). Its purpose is to load data needed for the page. It receives the _already validated_ parameters via its arguments.

The `ParamMatcher` code:

-   Lives in its own file inside the src/params/ directory.
-   Example file path: src/params/fastener.ts
    The +page.server.ts file (with the load function):
-   Lives inside the specific route directory that uses the matcher.
-   Example file path: src/routes/inventory/[type=fastener]/+page.server.ts

Workflow

1.  **Request:** A user navigates to `/inventory/bolts`.
2.  **Routing:** SvelteKit looks for matching routes. It finds `src/routes/inventory/[type=fastener]/`.
3.  **Matcher Execution:** SvelteKit sees `[type=fastener]`. It takes the value "bolts" from the URL and calls the `match` function in `src/params/fastener.ts`.
4.  **Matcher Result:** `fastener.match("bolts")` returns `true`.
5.  **Route Confirmed:** SvelteKit confirms this is the correct route.
6.  **Load Function Execution:** SvelteKit now executes the `load` function inside `src/routes/inventory/[type=fastener]/+page.server.ts`.
7.  **Parameter Access:** Inside `load`, the `params` object contains `{ type: 'bolts' }`. The `load` function accesses `params.type` knowing it has already been validated by the matcher.
8.  **Data Fetching:** The `load` function fetches data based on "bolts".
9.  **Return Data:** The `load` function returns the fetched data.
10. **Page Render:** The data is passed to `+page.svelte` for rendering.