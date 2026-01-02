---
title: Handling API errors with Sveltekit
description: Handling API errors with Sveltekit
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - ricettaparmigianadipatate
---
The canonical way to handle errors in SvelteKit HTTP APIs (i.e., in your `+server.js` or `+server.ts` files) is to use the `error` helper from `@sveltejs/kit`.

This helper allows you to throw an error that SvelteKit will automatically convert into an appropriate HTTP response with the correct status code and a JSON body.

Here's a breakdown:

1.  **Using the `error` Helper:**

    -   **Import it:** `import { error } from '@sveltejs/kit';`
    -   **Throw it:** `throw error(statusCode, messageOrObject);`
        -   `statusCode`: An HTTP status code (e.g., 400, 401, 403, 404, 500).
        -   `messageOrObject`:
            -   If a string is provided, the response body will be `{"message": "your string"}`.
            -   If an object is provided, that object will be stringified and used as the JSON response body. This is useful for providing more detailed error information.

2.  **How it Works:**
    When you `throw error(...)` inside a `GET`, `POST`, `PUT`, `DELETE`, etc., handler in a `+server.js` file:
    -   SvelteKit catches this specific type of error.
    -   It stops further execution of the handler.
    -   It constructs an HTTP `Response` object with:
        -   The `statusCode` you provided.
        -   A `Content-Type` of `application/json`.
        -   A body generated from your `messageOrObject`.
    -   This `Response` is then sent back to the client that made the API request.

**Examples:**

**`src/routes/api/items/+server.js`**

```javascript
import { error, json } from "@sveltejs/kit";

let items = [
    { id: 1, name: "Gadget" },
    { id: 2, name: "Widget" },
];

// GET /api/items
export async function GET() {
    return json(items);
}

// GET /api/items/[id] - This would be in src/routes/api/items/[id]/+server.js
// But for simplicity, let's imagine it's part of a more complex GET handler here
// or a POST handler that needs to find an item.

// POST /api/items
export async function POST({ request }) {
    try {
        const newItemData = await request.json();

        if (!newItemData.name || typeof newItemData.name !== "string") {
            // 400 Bad Request - Invalid input
            throw error(400, {
                message: "Item name is required and must be a string.",
            });
        }

        // Simulate authentication check
        const isAuthenticated =
            request.headers.get("Authorization") === "Bearer valid-token";
        if (!isAuthenticated) {
            // 401 Unauthorized
            throw error(401, "Authentication required.");
        }

        // Simulate trying to create an item that already exists (conceptually a 409 Conflict)
        if (
            items.find(
                (item) =>
                    item.name.toLowerCase() === newItemData.name.toLowerCase()
            )
        ) {
            throw error(409, {
                message: `Item with name '${newItemData.name}' already exists.`,
            });
        }

        const newItem = {
            id: Math.max(0, ...items.map((i) => i.id)) + 1,
            name: newItemData.name,
        };
        items.push(newItem);

        return json(newItem, { status: 201 }); // 201 Created
    } catch (e) {
        // If it's already a SvelteKit error, rethrow it
        if (e.status) {
            // SvelteKit errors have a 'status' property
            throw e;
        }
        // For unexpected errors, log them and return a generic 500
        console.error("Unexpected error:", e);
        throw error(500, "An internal server error occurred.");
    }
}

// Example for a specific item (imagine this is in /api/items/[id]/+server.js)
export async function GET_ITEM_EXAMPLE({ params }) {
    // Not a real SvelteKit export name
    const itemId = parseInt(params.id, 10);
    const item = items.find((i) => i.id === itemId);

    if (!item) {
        // 404 Not Found
        throw error(404, { message: `Item with ID ${itemId} not found.` });
    }
    return json(item);
}
```

**Handling on the Client-Side (e.g., in a `load` function or component):**

When you `fetch` these API endpoints:

```javascript
// In a +page.svelte or +page.js load function
export async function load({ fetch }) {
    // --- Fetching all items (likely successful) ---
    const allItemsResponse = await fetch("/api/items");
    let allItems = [];
    if (allItemsResponse.ok) {
        allItems = await allItemsResponse.json();
    } else {
        console.error(`Failed to fetch items: ${allItemsResponse.status}`);
        // Potentially show an error to the user or return an error prop
    }

    // --- Attempting to create an item (demonstrating error handling) ---
    let newItemResponse;
    let createdItemError = null;
    try {
        newItemResponse = await fetch("/api/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Authorization': 'Bearer valid-token' // Uncomment for success
            },
            body: JSON.stringify({ name: "New Gizmo" }), // Try with { name: 123 } for bad request
        });

        if (!newItemResponse.ok) {
            // The `error` helper on the server sent a JSON response
            const errorData = await newItemResponse.json();
            console.error(
                `API Error (${newItemResponse.status}):`,
                errorData.message || errorData
            );
            createdItemError =
                errorData.message || `Error ${newItemResponse.status}`;
            // throw new Error(errorData.message); // If you want to propagate to SvelteKit's error page
        } else {
            const createdItem = await newItemResponse.json();
            console.log("Successfully created:", createdItem);
        }
    } catch (e) {
        // Network errors or other unexpected client-side fetch issues
        console.error("Fetch request itself failed:", e);
        createdItemError = "Network request failed.";
    }

    return {
        allItems,
        createdItemError,
    };
}
```

**Key Advantages of `throw error(...)`:**

1.  **Standardization:** Provides a consistent way to signal errors from your API.
2.  **Clarity:** Makes the intent clear in your server code.
3.  **Automatic JSON Response:** SvelteKit handles creating the correct `Response` object with `application/json` content type.
4.  **Integration with SvelteKit:** If an error thrown this way is unhandled during server-side rendering (e.g., in a `load` function that calls this API internally), SvelteKit can render the nearest `+error.svelte` page. For direct API calls, the client simply gets the JSON error.
5.  **Customizable Payload:** You can pass an object to provide more detailed error information (e.g., validation errors for specific fields).

**Alternative (Less Canonical for API errors):**

You _could_ manually create and return a `Response` object using the `json` helper:

```javascript
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
    // ...
    if (!item) {
        return json(
            { message: "Item not found", errorCode: "ITEM_NOT_FOUND" },
            { status: 404 }
        );
    }
    // ...
}
```

While this works, `throw error(...)` is generally preferred for signaling actual error conditions because it's more idiomatic and integrates more deeply with SvelteKit's error handling mechanisms, especially if these API routes are also consumed by your server-side `load` functions. For simple status responses that aren't strictly "errors" but rather expected outcomes (e.g. an empty list), returning `json([], { status: 200 })` is fine.

**Global Error Handling (`handleError` hook):**

For unhandled errors that occur on the server (including those not caught in your API routes or unexpected exceptions), you can use the `handleError` server hook in `src/hooks.server.js`. This is more for logging, reporting, or transforming unexpected errors before they are sent to the client or SvelteKit's default error page.

```javascript
// src/hooks.server.js
/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event }) {
    // Log the error
    console.error("Unhandled Server Error:", error);
    console.error("Event details:", event.url.pathname, event.request.method);

    // You can customize the response for the user here
    // This is especially useful if SvelteKit is rendering an HTML error page
    return {
        message: "Whoops! Something went wrong on our end.",
        // You can add a custom error code or other details
        // code: 'UNEXPECTED_ERROR'
    };
}
```

In summary, `throw error(status, messageOrObject);` is the canonical and most SvelteKit-idiomatic way to handle expected errors within your HTTP API route handlers.