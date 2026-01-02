---
title: What does the svelte-kit json object do
description: What does the svelte-kit json object do
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - json
  - svelte
---
The `json` function from `@sveltejs/kit` is a **convenience helper function** used on the server-side (in `+server.js` files, or server `load` functions and `actions` in `+page.server.js` or `+layout.server.js`) to **create and return a standard Web `Response` object with a JSON payload and the correct `Content-Type` header.**

Here's a breakdown of what it does and why it's useful:

1.  **Serializes Data to JSON:**

    -   It takes a JavaScript object (or any value that can be JSON-serialized) as its first argument.
    -   It internally uses `JSON.stringify()` to convert this data into a JSON string.

2.  **Creates a `Response` Object:**

    -   SvelteKit endpoints and server functions are expected to return a standard `Response` object (part of the Web Fetch API). The `json` function handles the creation of this `Response` object for you.

3.  **Sets the `Content-Type` Header:**

    -   It automatically sets the `Content-Type` header of the `Response` to `application/json`. This is crucial for clients (like browsers or other services) to understand that the body of the response is JSON data.

4.  **Allows Setting Status Code and Custom Headers:**
    -   You can optionally provide a second argument, an options object, to customize the response:
        -   `status`: To set the HTTP status code (e.g., `200` for OK, `201` for Created, `404` for Not Found, `500` for Internal Server Error). Defaults to `200` if not specified.
        -   `headers`: An object to set additional custom HTTP headers.

**Why is it used?**

Without the `json` helper, you would have to manually construct the `Response` object like this:

```javascript
// src/routes/api/data/+server.js

export function GET() {
    const myData = { message: "Hello, world!" };
    return new Response(JSON.stringify(myData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
```

With the `json` helper, it becomes much more concise and less error-prone:

```javascript
// src/routes/api/data/+server.js
import { json } from "@sveltejs/kit";

export function GET() {
    const myData = { message: "Hello, world!" };
    return json(myData); // Defaults to status 200
}
```

**Examples:**

1.  **Basic API Endpoint:**

    ```javascript
    // src/routes/api/items/+server.js
    import { json } from "@sveltejs/kit";

    export async function GET() {
        const items = [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" },
        ];
        return json(items); // Responds with status 200 and Content-Type: application/json
    }
    ```

2.  **Responding with a different status code (e.g., after creating a resource):**

    ```javascript
    // src/routes/api/items/+server.js
    import { json } from "@sveltejs/kit";

    export async function POST({ request }) {
        const newItemData = await request.json();
        // ... logic to save newItemData to a database ...
        const createdItem = { id: 3, ...newItemData };
        return json(createdItem, { status: 201 }); // 201 Created
    }
    ```

3.  **Responding with an error:**

    ```javascript
    // src/routes/api/items/[id]/+server.js
    import { json } from "@sveltejs/kit";

    export async function GET({ params }) {
        const item = findItemById(params.id); // Assume this function exists
        if (!item) {
            return json(
                { message: `Item with ID ${params.id} not found` },
                { status: 404 }
            );
        }
        return json(item);
    }
    ```

4.  **In a server `load` function:**

    ```javascript
    // src/routes/products/+page.server.js
    import { json } from "@sveltejs/kit";

    export async function load() {
        // In a real app, you'd fetch this from a DB or API
        const products = [
            { id: "p1", name: "Super Widget" },
            { id: "p2", name: "Mega Gadget" },
        ];
        // Note: In load functions, you usually just return the object directly.
        // SvelteKit handles serializing it for the client.
        // `json()` is more common for standalone API endpoints or when you need
        // to specifically control the Response object being formed by the load function,
        // for instance, if the load function itself is acting like an API for a form action.
        // However, if you were to directly call this endpoint via fetch, returning json() would be appropriate.
        return { products }; // SvelteKit handles this correctly for page data

        // If this load function was being used by a form action that expects a JSON response:
        // return json({ products }); // This would also work but is often not needed here
    }
    ```

    _Correction for load function usage:_ While you _can_ use `json()` in `load`, it's more common to just return the plain JavaScript object. SvelteKit's `load` function mechanism will automatically serialize this data for the page. The `json()` utility is most vital for dedicated API endpoints (`+server.js`) or when an `action` needs to return a JSON response (e.g., to be consumed by client-side JavaScript using `enhance` with `fetch`).

In summary, `@sveltejs/kit`'s `json` function is a server-side utility that simplifies the process of returning JSON data from your SvelteKit application, ensuring the correct `Response` object is constructed with the appropriate headers and status code.