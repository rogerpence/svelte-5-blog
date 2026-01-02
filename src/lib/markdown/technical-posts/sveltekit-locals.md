---
title: Sveltekit locals
description: Sveltekit locals
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
how to use http context api with sveltekit to pass data from one request to another

While SvelteKit doesn't have a built-in "HTTP Context" API like some server-side frameworks, we can achieve similar functionality using **`locals`** within the SvelteKit server hooks, along with techniques like passing data through the URL, or temporary storage.

Here's a breakdown of different approaches and how to implement them in your SvelteKit app:

**Understanding `locals` in SvelteKit**

-   `locals` is an object available in your SvelteKit server-side hooks ( `src/hooks.server.js` or `src/hooks.server.ts`) that persists across a single request/response cycle.
-   It's ideal for passing data between different hooks within the same request or even passing information to your load functions.
-   **Crucially, `locals` is only available server-side, it's not directly accessible in your client-side components.**

**Common Approaches**

1. **Using `locals` for Request-Scoped Data**

    - **Scenario:** You need to set a flag or some data in one hook, and use it in another hook or your load function during the _same request_.
    - **Example:**

        ```typescript
        // src/hooks.server.ts
        import type { Handle } from "@sveltejs/kit";

        export const handle: Handle = async ({ event, resolve }) => {
            if (event.url.pathname.startsWith("/protected")) {
                event.locals.user = { id: 123, name: "John Doe" }; // Setting user on locals
            }

            const response = await resolve(event);
            return response;
        };
        ```

        ```typescript
        // src/routes/+page.server.ts
        import type { PageServerLoad } from "./$types";

        export const load: PageServerLoad = async ({ locals }) => {
            if (locals.user) {
                return {
                    greeting: `Hello, ${locals.user.name}`,
                };
            } else {
                return {
                    greeting: "Hello Stranger",
                };
            }
        };
        ```

        - **Explanation:**
            - The `handle` hook checks if the route starts with `/protected`. If so, it adds a `user` object to `event.locals`.
            - The `load` function can access `event.locals` and use the `user` data.
            - This data is specific to that single request.

    - **Limitations:** Data set in `locals` will not carry over between different requests.

2. **Passing Data via the URL (Query Parameters)**

    - **Scenario:** You need to persist data between requests, for example, redirecting after a form submit while carrying context information.
    - **Example:**

        ```typescript
        // src/routes/form/+page.server.ts
        import { redirect } from "@sveltejs/kit";
        import type { Actions } from "./$types";

        export const actions: Actions = {
            default: async ({ request }) => {
                const formData = await request.formData();
                const name = formData.get("name");
                // ... processing logic
                throw redirect(303, `/success?userName=${name}`);
            },
        };
        ```

        ```svelte
        // src/routes/form/+page.svelte
        <form method="post">
          <input type="text" name="name" />
          <button type="submit">Submit</button>
        </form>
        ```

        ```typescript
        // src/routes/success/+page.server.ts
        import type { PageServerLoad } from "./$types";

        export const load: PageServerLoad = async ({ url }) => {
            const userName = url.searchParams.get("userName");

            return {
                userName,
                message: `Thanks ${userName} for submitting!`,
            };
        };
        ```

        ```svelte
        // src/routes/success/+page.svelte
        <p>{data.message}</p>
        ```

    - **Explanation:**
        - After a form submission, we redirect to `/success` and include the `name` from the form as a query parameter.
        - The `success` route's `load` function can access the parameter using `url.searchParams`
    - **Considerations:**
        - This is suitable for small pieces of data that can be safely exposed in the URL.
        - Avoid exposing sensitive information.
        - Keep URL lengths within reasonable limits.

3. **Temporary Storage (e.g., Database, Redis, Session Storage):**

    - **Scenario:** You need to preserve data across requests and potentially across multiple user sessions.
    - **Example (using session storage with an in-memory adapter):**

        ```typescript
        // src/hooks.server.ts
        import type { Handle, HandleServerError } from "@sveltejs/kit";

        interface UserData {
            userId: number;
            name: string;
        }

        const sessionStore = new Map<string, UserData>();

        function createSessionId() {
            return crypto.randomUUID();
        }

        export const handle: Handle = async ({ event, resolve }) => {
            let sessionId = event.cookies.get("sessionId");
            let userData: UserData | undefined = undefined;
            if (!sessionId) {
                sessionId = createSessionId();
                event.cookies.set("sessionId", sessionId);
            }
            if (sessionStore.has(sessionId)) {
                userData = sessionStore.get(sessionId);
                event.locals.user = userData;
            }

            if (event.url.pathname === "/login") {
                if (!sessionId) {
                    sessionId = createSessionId();
                    event.cookies.set("sessionId", sessionId);
                }
                const user = { userId: 1, name: "John Doe" } as UserData;
                sessionStore.set(sessionId, user);
                event.locals.user = user;
                throw redirect(302, "/");
            }
            const response = await resolve(event);
            return response;
        };

        export const handleError: HandleServerError = async ({
            error,
            event,
        }) => {
            console.error("Error in handle:", error);
            return {
                message: "A server error occurred.",
                error,
            };
        };
        ```

        ```typescript
        // src/routes/+page.server.ts
        import type { PageServerLoad } from "./$types";

        export const load: PageServerLoad = async ({ locals }) => {
            return {
                message: locals?.user
                    ? `Hello ${locals.user.name}`
                    : "Hello anonymous user",
            };
        };
        ```

    - **Explanation:**
        - We're using a simple `Map` as an in-memory store (for demonstration only, in production use a proper database, Redis, etc.).
        - We generate a session ID (UUID) and store it as a cookie.
        - When a request comes in:
            - If we find a valid session ID in cookies, we restore the session data from our storage.
            - If the path is /login, we can set the user into storage
        - We can use the `locals` to pass down the user data during the request
    - **Considerations:**
        - This approach is more complex but allows you to handle user sessions and persistent data.
        - Choose appropriate persistent storage based on your needs.
        - Implement a proper session management strategy.

**Choosing the Right Approach**

-   **`locals`:** Ideal for short-lived data specific to a single request.
-   **URL parameters:** Suitable for basic data to be passed between requests via redirects.
-   **Temporary storage:** Necessary for persisting data across requests and sessions, consider using databases, Redis or more persistent forms of session storage in production

**Important Notes:**

-   **Security:** Be mindful of security when passing data around. Don't expose sensitive data in URLs.
-   **Scalability:** If you need to handle many concurrent requests or persist data across multiple users, use a robust solution such as a database or Redis.
-   **Session Management:** If you're dealing with user authentication and sessions, research secure session handling techniques.

By carefully considering the different techniques and choosing the right approach for your particular use case, you can implement a robust and efficient data passing system in your SvelteKit application.