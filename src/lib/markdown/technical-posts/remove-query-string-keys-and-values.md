---
title: Remove values from the current URL query string
description: Remove values from the current URL query string
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
This code uses JavaScript's [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) interface to remove query string keys and values from the current URL. Prior to removing them, all of the query string keys and values are available to the code.

> This only works on the client side!

```
import { page } from '$app/stores';
import { browser } from '$app/environment';

export const getPurgedQueryStringUrl = (url, excludeKeys) => {
    const newParams = new URLSearchParams();

    for (const [key, value] of url.searchParams) {
        if (!excludeKeys.includes(key)) {
            newParams.append(key, value);
        }
    }
    if ([...newParams].length == 0) {
        return `${url.origin}${url.pathname}`
    }
    else {
        return `${url.origin}${url.pathname}?${newParams}`;
    }
};

...

// Remove the 'email' and 'type' keys from the query string.
if (browser) {
	newUrl = getPurgedQueryStringUrl($page.url, ['email', 'type']);
	window.history.pushState({}, document.title, newUrl);
}
```