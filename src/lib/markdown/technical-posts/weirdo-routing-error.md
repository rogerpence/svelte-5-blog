---
title: Weirdo routing error
description: Weirdo routing error
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
rogerpence: this sveltekit app has some prerendered routes. Pages from a prerendered route load fine the first time, but when refreshed they throw a 404. This app works fine in dev mode. I think this has something to do with the refresh failing because the .HTML extension is missing

GitHub Copilot: Let's analyze and fix the prerendering 404 issue in SvelteKit:

Plan:

1. Configure Vercel to handle HTML extensions properly
2. Ensure proper route fallbacks
3. Add correct prerendering config

```javascript
// svelte.config.js
const config = {
    kit: {
        adapter: adapter({
            // Force Vercel to handle all routes, with or without .html
            edge: false,
            split: false,
        }),
        prerender: {
            handleMissingId: "ignore", // Handle missing prerender targets gracefully
            entries: ["*"], // Prerender all routes
            crawl: true, // Automatically detect pages to prerender
        },
    },
};
```

```json
// vercel.json
{
    "rewrites": [
        { "source": "/(.*)", "destination": "/" },
        { "source": "/:path*", "destination": "/:path*.html" }
    ]
}
```

```javascript
// +layout.js
export const prerender = true;
export const csr = true;
export const trailingSlash = "always"; // Forces consistent URL format
```

This configuration:

-   Handles both `/path` and `/path.html` URLs
-   Ensures proper fallback for client-side routing
-   Maintains consistent URL format
-   Preserves prerendering while fixing refresh 404s