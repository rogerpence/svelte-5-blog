---
title: async-await-promise-error-handling
description: async-await-promise-error-handling
date_created: '2025-05-30T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
  - typescript
---
```ts
async function deleteRow(id: number) {
    const request = ms.pool.request();
    const query = `
        DELET FROM categoryrules WHERE id = @id
    `;
    request.input("id", ms.sql.Int, id);
    const result = await request.query(query);

    return result.rowsAffected[0];
}

...

let count = await deleteRow(44).catch((err) => {
    console.error("Error executing delete query:", err.message);
});
```

Okay, let's break this down. This syntax leverages how `async/await` works with Promises.

1.  **`async` Functions Return Promises:**
    Any function declared with `async` (like `async function deleteRow(...)` presumably is) implicitly returns a Promise.
    *   If the `async` function completes successfully (e.g., executes a `return value;`), the Promise it returned resolves with that `value`.
    *   If the `async` function throws an error (or a Promise it `await`s inside it rejects), the Promise it returned rejects with that error.

2.  **`deleteRow(44)` is a Promise:**
    So, when you call `deleteRow(44)`, you're not immediately getting the result. You're getting a Promise that *will eventually* resolve to the result (e.g., a count of deleted rows) or reject with an error.

3.  **`.catch()` is a Promise Method:**
    Promises have built-in methods like `.then()` (for success) and `.catch()` (for failure).
    When you do `somePromise.catch(errorHandlerFunction)`, you're attaching an error handler to `somePromise`.
    *   If `somePromise` rejects, `errorHandlerFunction` is called.
    *   Importantly, `somePromise.catch(...)` *itself returns a new Promise*.
        *   If `somePromise` resolves, this new Promise resolves with the same value.
        *   If `somePromise` rejects, and your `errorHandlerFunction` handles it (and doesn't re-throw an error), this new Promise *resolves* with the return value of your `errorHandlerFunction`. If your handler doesn't explicitly return anything, it resolves with `undefined`.

4.  **Putting it Together with `await`:**
    Let's look at your line:
    `let count = await deleteRow(44).catch((err) => { ... });`

    *   `deleteRow(44)`: This executes and returns `PromiseA`.
    *   `PromiseA.catch((err) => { ... })`: You attach an error handler to `PromiseA`. This operation *itself* returns `PromiseB`.
        *   **Scenario 1: `deleteRow(44)` succeeds (PromiseA resolves)**
            *   `PromiseA` resolves, let's say with the value `1` (e.g., 1 row deleted).
            *   The `.catch()` handler is **skipped**.
            *   `PromiseB` (returned by `.catch()`) resolves with the same value as `PromiseA`, which is `1`.
        *   **Scenario 2: `deleteRow(44)` fails (PromiseA rejects)**
            *   `PromiseA` rejects with an `err` object.
            *   The `.catch((err) => { ... })` handler is **executed**:
                *   `console.error("Error executing delete query:", err.message);` is run.
                *   This error handler function doesn't explicitly `return` anything.
            *   Because the error was "caught" and handled (and no new error was thrown from within the catch block), `PromiseB` (returned by `.catch()`) now *resolves* with `undefined` (the implicit return value of your catch handler).
    *   `await PromiseB`: The `await` keyword then waits for `PromiseB` to settle.
        *   In Scenario 1 (success): `await` gets the `1` from `PromiseB`, so `count` becomes `1`.
        *   In Scenario 2 (failure): `await` gets `undefined` from `PromiseB`, so `count` becomes `undefined`.

**Why is this useful?**

*   **Inline Error Handling & Default Value:** It allows you to handle a potential error from a specific promise and provide a "default" or "fallback" result for `await` without using a full `try...catch` block that might feel verbose for a single operation. The `await` itself won't throw an error in this case because the `.catch` has handled it.
*   **Continuation:** The code continues, and `count` will have a defined value (either the success result or what your `.catch` handler resolves to).

**Comparison with `try...catch`:**

The more common way you might see error handling with `await` is:

```javascript
let count;
try {
    count = await deleteRow(44);
} catch (err) {
    console.error("Error executing delete query:", err.message);
    // count would be undefined here, or you could set a default:
    // count = 0; // Or some other indicator of failure
}
// Now 'count' is either the result or undefined/0
```

**Key Differences in your example vs. typical `try...catch`:**

*   **Value of `count` on error:**
    *   Your syntax: `count` will be `undefined` (because your catch handler doesn't return anything). If your catch handler returned `0`, then `count` would be `0`.
    *   `try...catch`: `count` would typically remain `undefined` (if declared outside) or you'd explicitly assign it a value in the `catch` block.
*   **No `await` throwing:** In your syntax, the `await` operation itself is "guaranteed" not to throw an error that escapes *it*, because any rejection from `deleteRow(44)` is caught by the chained `.catch()`, which then makes the promise it returns *resolve*. (Unless your `.catch()` handler itself throws a new error).

**In summary:**

You are calling `deleteRow(44)`, which returns a Promise. You immediately attach a `.catch()` handler to *that Promise*. The `await` keyword then waits for the outcome of this *new Promise* (the one returned by the `.catch()` method). If the original promise rejects, your catch handler runs, and the new promise resolves (typically with `undefined` or whatever your catch handler returns), preventing the `await` from throwing.

This technique **can be a very clean and concise way to handle errors for specific, often isolated, asynchronous operations, especially when:**

1.  **You want to provide a default value:** If `deleteRow` fails, you might want `count` to be `0` or `null` instead of the `await` throwing and potentially halting the entire `async` function (if not wrapped in a larger `try...catch`).
    ```javascript
    let count = await deleteRow(44).catch((err) => {
        console.error("Failed to delete, defaulting count to 0:", err.message);
        return 0; // Provide a default value
    });
    // count will be the actual deleted count on success, or 0 on failure.
    ```

2.  **The error is truly "local" and doesn't need to propagate:** If the failure of `deleteRow` isn't critical to the overall success of the calling `async` function, and logging it is sufficient, then this pattern is neat. The rest of the `async` function can continue.

3.  **You want to avoid a more verbose `try...catch` for a single line:** For one-off calls where the error handling is simple, it's less boilerplate than:
    ```javascript
    let count;
    try {
        count = await deleteRow(44);
    } catch (err) {
        console.error("Error executing delete query:", err.message);
        // count would be undefined here, or you could set it
        // count = 0;
    }
    ```
    The inline `.catch()` is more compact for this specific case.

**However, there are important considerations and potential downsides:**

1.  **Error Swallowing/Masking:** The biggest danger is that you "swallow" an error that perhaps *should* have propagated. The `await` itself won't throw. If `deleteRow` fails due to a critical issue (e.g., database disconnected), just setting `count` to `undefined` (or `0`) might hide a serious problem, and the application might continue in an inconsistent state.
    *   The calling code might not "realize" an error occurred unless it explicitly checks if `count` is `undefined` (or your default error value).

2.  **Loss of Error Context for Callers:** If the `async` function containing this line is itself called by another function that expects it to throw on failure, this pattern breaks that expectation.

3.  **Debugging:** It can sometimes make debugging harder if an error is caught, logged, and then the program continues with a default value. You might see unexpected behavior later on due to that default value, and it might not be immediately obvious that an earlier operation failed silently (from the perspective of throwing).

4.  **Readability for Complex Handling:** If your error handling logic within the `.catch()` becomes more complex than a simple log and return, the single line can become unwieldy and less readable than a dedicated `try...catch` block.

5.  **Distinguishing "No Rows Deleted" from "Error":** If `deleteRow` could successfully delete 0 rows (and return `0`), and your error handler also returns `0`, you lose the ability to distinguish between successful deletion of nothing and an actual error. In your original example, an error results in `count` being `undefined`, which *is* distinguishable from a successful return of `0`.

**When is it most appropriate?**

*   For **optional operations** where failure is acceptable and a default/fallback is fine.
*   When you want to **log an error but continue execution** with a sensible default.
*   For **non-critical side effects** where the main flow of the program shouldn't be interrupted by their failure.

**When might a `try...catch` block be better?**

*   When the error is critical and **should halt the current `async` function's execution** and propagate to the caller.
*   When you need to perform **more complex error recovery logic**.
*   When you are `await`ing **multiple promises in a sequence**, and any one of them failing should trigger a common catch block.
    ```javascript
    try {
        const result1 = await operation1();
        const result2 = await operation2(result1);
        // ...
    } catch (err) {
        // Handle error from any of the awaited operations
    }
    ```

So, yes, for "rarely occurring errors" where the consequence of the error is simply needing a default value or logging the issue without stopping the flow, it's a clean and elegant pattern. Just be mindful of not accidentally masking errors that should be handled more seriously.