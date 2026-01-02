---
title: How to replace an API call that use query string arguments to something that with SSR for Sveletekit
description: How to replace an API call that use query string arguments to something that with SSR for Sveletekit
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - sveltekit
---
To replace an API call using query string arguments with server-side rendering (SSR) in SvelteKit, you can fetch the data directly from the server-side load function of your page or layout. This avoids the need for client-side API calls.

Here’s a general approach:

1. **Remove Client-Side API Call**: Eliminate any client-side fetch calls that are using query strings.

2. **Use the `load` Function in SvelteKit**: Define the `load` function in your page or layout's `+page.js/+layout.js` file. The `load` function runs on the server during SSR and can access the query parameters from the request URL.

3. **Access Query Parameters**: Use `url.searchParams.get('param')` inside the `load` function to retrieve the query string parameters. This data can then be passed to your page component.

4. **Return the Data to the Page**: Return the fetched data as part of the `load` function’s return object. The page can access this data as `data`.

Here’s a basic example:

```js
// +page.js or +layout.js
export async function load({ fetch, url }) {
    // Extract query params from the URL
    const param = url.searchParams.get("param");

    // If you were calling an API, you can do it here using SSR
    const response = await fetch(`/api/some-endpoint?param=${param}`);
    const data = await response.json();

    return {
        data,
    };
}
```

In your Svelte component:

```svelte
<script>
  export let data;
</script>

<p>{data.someValue}</p>
```

With this setup, the API call happens server-side, using SSR, and the data is sent directly to the component during the page load. This way, you avoid client-side API requests and achieve better performance and SEO.