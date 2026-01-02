---
title: Sveltekit nuggets
description: Sveltekit nuggets
date_created: '2025-02-01T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - nuggets
---
## Set a page title (or do other things in the head tag)

```
<svelte:head>
	<title>Server Data Example</title>
</svelte:head>
```

> The docs say, "In server-side rendering (SSR) mode, contents of `<svelte:head>` are returned separately from the rest of your HTML." I'm not sure of the impact of this, but I think it means use this sparingly. Anything you know needs to be the `head` should be added to the `app.html` file.

## Change the URL at runtime

```
const newUrl = $page.url.origin + $page.url.pathname + '/?family=' + family;
window.history.pushState({}, document.title, newUrl);
```

## Determine dev or production 

```
import { dev } from '$app/environment'; // Import SvelteKit's environment

...
if (dev) {
    // Running dev mode.
}
else {
	// Running in production mode.
}
```

## Bind an input tag to a checkbox

```
<script>
	let show = true
</script>

<input bind:checked={show} type="checkbox"/>
```

## Install Svelte command line 

> Even if you intend to use the Sveltekit CLI with PNPM, install `sv` with `npm`.
```
npm install -g sv 
```

With `sv` installed, create a new Sveltekit project. This creates a folder named \<project name\>. Change to it after the project is created. 

```
npx sv create <project name>
```

## Get dev/prod domains at runtime

.env file 

```
DOMAIN_DEVELOPMENT="http://localhost:5173"
DOMAIN_PRODUCTION="https://asna.com"
```

Example use

```
import { env } from '$env/dynamic/private'; // For accessing environment variables securely
import { dev } from '$app/environment'; // Import SvelteKit's environment

function getDomain() {
    if (dev) {
        return env.DOMAIN_DEVELOPMENT;
    } else {
        return env.DOMAIN_PRODUCTION;
    }
}
```

## Copy data to the clipboard

```ts
<script lang="ts">
import { browser } from '$app/environment';

function updateClipboard(newClip: string) {
	navigator.clipboard.writeText(newClip).then(
		() => {
			console.log('clipboard successfully set');
		},
		() => {
			console.log('clipboard successfully set');
		}
	);
}

function copyTokenToClipboard(token: string) {
	updateClipboard(token);
}


</script>

<button type="button" onclick={() => copyTokenToClipboard(data.LOGMEIN_ORGANIZER_ID)}>Copy</button>


<style>
	// This CSS is probably a little overboard to style the button.
	
    .button-as-link {
        display: inline-block; /* Make it behave like a link */
        /* 1. Reset Button Defaults */
        background: none; /* Remove default background */
        border: none; /* Remove default border */
        padding: 0; /* Remove default padding */
        font: inherit; /* Inherit font from parent */
        color: #007bff; /* Standard link blue color (adjust as needed) */
        text-decoration: underline; /* Add underline, like a link */
        cursor: pointer; /* Show pointer cursor, like a link */
        text-align: left; /* Align text to the left if button was centering it */

        /* Optional: Remove browser-specific button styling (especially for Safari/iOS) */
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    /* 2. Style Hover & Focus States (like a link) */
    .button-as-link:hover,
    .button-as-link:focus {
        color: #0056b3; /* Darker blue on hover/focus */
        text-decoration: none; /* Often links lose underline on hover */
        /* Or, to keep underline and just change color:
     text-decoration: underline;
  */
    }

    /* Optional: Style Active State (when clicked) */
    .button-as-link:active {
        color: #004085; /* Even darker blue or different color for active state */
    }

    /* 3. Style Disabled State (if you use it) */
    .button-as-link:disabled {
        color: #6c757d; /* Muted color for disabled state */
        text-decoration: none; /* No underline for disabled */
        cursor: not-allowed; /* Not-allowed cursor for disabled */
    }

    /* Optional: Ensure focus outline is visible for accessibility */
    .button-as-link:focus-visible {
        /* Modern browsers */
        outline: 2px solid #007bff;
        outline-offset: 2px;
    }
    /* Fallback for older browsers (might show on click too) */
    .button-as-link:focus {
        outline: 2px solid #007bff;
        outline-offset: 2px;
    }
    /* If you want to remove the default button focus ring before adding your own */
    .button-as-link:focus {
        outline: none; /* First remove default, then add custom below */
    }
    .button-as-link:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 2px;
    }
</style>
```

## Add an internal CSS file to Svelte

in top-level +layout.svelte

where `src\main.css`

```
<script>
    let { children } = $props();    

    import '../main.css';
</script>

<div class="main-wrapper">
    {@render children()}
</div>
```