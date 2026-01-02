---
title: SvelteKit global error handling
description: SvelteKit global error handling
date_created: 2025-06-14T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
---
Of course! This is an excellent question, as robust error handling is crucial for any production application.

In SvelteKit 2 (which uses Svelte 5 by default), the "best way" to add global error handling is a layered approach that combines three key features:

1.  **`+error.svelte`:** The user-facing page that displays when an error occurs.
2.  **`hooks.server.js`:** A server-side hook to intercept, log, and process errors before they are sent to the user. This is your primary tool for server-side global handling.
3.  **`hooks.client.js`:** A client-side hook to catch errors that happen exclusively in the browser after hydration.

Let's break down how to use them together for a complete solution.


### The Core Strategy

| File | Purpose | When it Runs |
| :--- | :--- | :--- |
| **`src/routes/+error.svelte`** | **Displays the error** to the user. | When an error is thrown on the server, or you navigate to a non-existent route. |
| **`src/hooks.server.js`** | **Catches & Logs** all unhandled server-side errors. | On the server, *before* `+error.svelte` is rendered. Ideal for logging to services like Sentry, Axiom, etc. |
| **`src/hooks.client.js`** | **Catches & Logs** all unhandled client-side errors. | In the browser, for errors that occur after the initial page load (e.g., in an event handler). |


### Part 1: The User-Facing Error Page (`+error.svelte`)

This is the component your users will see. You should create a root-level one to catch all errors across your application.

**`src/routes/+error.svelte`**

```svelte
<script>
	import { page } from '$app/stores';

	// The $page store contains the status code and error object
	const status = $page.status;
	const error = $page.error;
</script>

<div class="error-container">
	<h1>{status}</h1>

	{#if error?.message}
		<p>{error.message}</p>
	{:else}
		<p>Something went wrong.</p>
	{/if}

	{#if status === 404}
		<p>We couldn't find the page you were looking for.</p>
	{:else if status >= 500}
		<p>Our team has been notified of the problem. Please try again later.</p>
	{/if}

	<a href="/">Go to Homepage</a>
</div>

<style>
	.error-container {
		text-align: center;
		margin-top: 5rem;
	}
	h1 {
		font-size: 4rem;
		color: #ff3e00;
	}
</style>
```

This component automatically receives the `status` and `error` object through the `$page` store.


### Part 2: Global Server-Side Handling (`hooks.server.js`)

This is the most important part for **global backend error handling**. The `handleError` hook runs for any unhandled error on the server (in `load` functions, form actions, API routes, or rendering).

This is the perfect place to:
*   Log the full error details (including stack trace) to a logging service.
*   Scrub sensitive information from the error before it's sent to the client.
*   Send notifications to your team (e.g., via Slack or email).

**`src/hooks.server.js`** (or `.ts`)

```javascript
// @ts-check
import { dev } from '$app/environment';

/**
 * This function is the global error handler for the server.
 * @type {import('@sveltejs/kit').HandleServerError}
 */
export async function handleError({ error, event }) {
	// `error` is the actual error object
	// `event` is the SvelteKit event object
	const errorId = crypto.randomUUID();

	// 1. Log the error
	// In a real app, you'd send this to Sentry, LogRocket, etc.
	console.error('Unhandled Server Error:', {
		errorId,
		error,
		url: event.url.pathname,
		// You can add user info if available:
		// userId: event.locals.user?.id
	});

	// 2. Return a "sanitized" error object for the client
	// This prevents leaking sensitive implementation details.
	// The `message` property will be available in `$page.error.message`
	// on the `+error.svelte` page.
	const publicError = {
		message: `An unexpected error occurred. Please quote this ID if you contact support: ${errorId}.`,
		errorId
	};

	// For developers, still show the full error in development
	if (dev) {
		return {
			...publicError,
			message: /** @type {Error} */ (error).message,
			stack: /** @type {Error} */ (error).stack
		};
	}

	return publicError;
}
```

Now, any unexpected server crash will be logged, and the user will see the friendly message from `publicError` on your `+error.svelte` page instead of a scary stack trace.


### Part 3: Global Client-Side Handling (`hooks.client.js`)

This hook catches errors that happen *only* in the browser after the application has been hydrated. These errors **do not** trigger the `+error.svelte` page because the app is already running.

This is the place to report client-side issues to your logging service.

**`src/hooks.client.js`** (or `.ts`)

```javascript
// @ts-check

/** @type {import('@sveltejs/kit').HandleClientError} */
export async function handleError({ error, event }) {
	const errorId = crypto.randomUUID();

	// In a real app, you'd send this to a client-side error tracker
	console.error('Unhandled Client Error:', {
		errorId,
		error,
		url: event.url.pathname
	});

	// You can optionally show a toast notification or a modal to the user
	// For example, using a custom store:
	// import { userAlerts } from '$lib/stores/alerts';
	// userAlerts.show('An error occurred. Please refresh the page.');

	return {
		message: `A client-side error occurred. Ref: ${errorId}`,
		errorId
	};
}
```


### How to Intentionally Trigger Errors (The "Right" Way)

When you need to stop execution and show an error page for predictable reasons (like "Not Found" or "Permission Denied"), don't just `throw new Error()`. Instead, use the `error` helper from SvelteKit.

This signals to SvelteKit that it's an *expected* error, and it will gracefully render your `+error.svelte` page with the correct status code.

**Example in a `load` function:**

**`src/routes/posts/[slug]/+page.server.js`**

```javascript
import { error } from '@sveltejs/kit';
import { getPost } from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	// Example: Permission check
	if (!locals.user) {
		// 401 Unauthorized
		throw error(401, 'You must be logged in to view this post.');
	}

	const post = await getPost(params.slug);

	if (!post) {
		// 404 Not Found
		throw error(404, 'Post not found');
	}

	return { post };
}
```

**Key Difference:**
*   `throw error(404, ...)`: **Expected error**. Skips `handleError` hook, goes directly to `+error.svelte`. This is correct for 4xx status codes.
*   `throw new Error(...)`: **Unexpected error**. Is caught by `handleError` hook, then goes to `+error.svelte`. This is what happens when your code truly breaks.

### Summary: The Complete Workflow

1.  **Create `src/routes/+error.svelte`:** Design your beautiful, user-friendly error page.
2.  **Create `src/hooks.server.js`:** Implement the `handleError` function to log all unexpected backend crashes and sanitize the error message for the user.
3.  **Create `src/hooks.client.js`:** (Optional but recommended) Implement `handleError` to catch and log errors that only happen in the browser.
4.  **Use `throw error(status, message)`** in your `load` functions and form actions for all *expected* error conditions like 404s, 403s, etc.
5.  Let your `hooks.server.js` automatically catch all other unexpected exceptions.

This layered approach ensures that you have complete, robust, and secure error handling for your SvelteKit 2 application.