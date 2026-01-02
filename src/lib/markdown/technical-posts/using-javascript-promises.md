---
title: using-javascript-promises
description: using-javascript-promises
date_created: '2025-05-27T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
  - typescript
---
Okay, here's a simple TypeScript example of a function that returns a Promise, simulating work with `setTimeout`, and then examples of how to call it using both traditional `.then().catch()` and the more modern `async/await`.

```typescript
// 1. The function that returns a Promise
function simulateAsyncTask(taskName: string, durationMs: number): Promise<string> {
    console.log(`Starting task: ${taskName} (will take ${durationMs}ms)`);

    // Return a new Promise
    return new Promise((resolve, reject) => {
        // Simulate asynchronous work using setTimeout
        setTimeout(() => {
            // For this example, we'll always resolve successfully.
            // In a real scenario, you might have conditions to reject.
            if (durationMs < 0) {
                reject(new Error(`Task "${taskName}" failed: Invalid duration.`));
            } else {
                const result = `Task "${taskName}" completed successfully after ${durationMs}ms.`;
                console.log(`Finishing task: ${taskName}`);
                resolve(result); // Fulfill the promise with a result
            }
        }, durationMs);
    });
}

// 2. Example of calling the function using .then() and .catch()
console.log("--- Using .then() and .catch() ---");

simulateAsyncTask("Data Fetching", 2000)
    .then((message) => {
        // This block executes when the promise is resolved (successful)
        console.log("Success (then):", message);
        // You can chain more async operations here
        return simulateAsyncTask("Data Processing", 1000);
    })
    .then((nextMessage) => {
        console.log("Success (second then):", nextMessage);
    })
    .catch((error) => {
        // This block executes if the promise is rejected (error)
        console.error("Error (catch):", error.message);
    })
    .finally(() => {
        // This block executes regardless of success or failure
        console.log("Operation attempted (finally).\n");
    });

// Example of a task that might fail (to demonstrate .catch)
simulateAsyncTask("Risky Operation", -500)
    .then(message => console.log("This won't be reached:", message))
    .catch(error => console.error("Error from Risky (catch):", error.message))
    .finally(() => console.log("Risky operation attempted (finally).\n"));


// 3. Example of calling the function using async/await
// We need an async function to use 'await'
async function runTasksWithAsyncAwait() {
    console.log("--- Using async/await ---");

    try {
        console.log("Calling first task with await...");
        const result1 = await simulateAsyncTask("Image Loading", 1500);
        // Code here waits for simulateAsyncTask to resolve
        console.log("Success (await 1):", result1);

        console.log("Calling second task with await...");
        const result2 = await simulateAsyncTask("Rendering UI", 500);
        console.log("Success (await 2):", result2);

        console.log("Calling a potentially failing task with await...");
        const result3 = await simulateAsyncTask("Another Risky Op", -100);
        console.log("This line won't be reached if the above fails:", result3);

    } catch (error: any) { // Explicitly type error or use 'unknown' and check type
        // Any rejected promise from an 'await' call will be caught here
        console.error("Error (await catch):", error.message);
    } finally {
        // This block executes regardless of success or failure within the try block
        console.log("Async/await operations attempted (finally).\n");
    }
}

// Call the async function to execute the async/await examples
// We need to wait a bit for the .then/.catch examples to run before starting async/await
// or they will interleave their console logs.
setTimeout(() => {
    runTasksWithAsyncAwait();
}, 4000); // Wait 4 seconds to let the previous examples mostly finish printing


// To run this:
// 1. Save as `promise_example.ts`
// 2. Compile: `tsc promise_example.ts`
// 3. Run: `node promise_example.js`
```

**Explanation:**

1.  **`simulateAsyncTask(taskName: string, durationMs: number): Promise<string>`**
    *   This function takes a `taskName` (for logging) and `durationMs` (to simulate work).
    *   It returns `Promise<string>`, meaning it promises to eventually produce a string value.
    *   `new Promise((resolve, reject) => { ... })`: This is the core of creating a promise.
        *   `resolve`: A function you call when the asynchronous operation is successful. The argument passed to `resolve` (e.g., `result`) will be the value the promise fulfills with.
        *   `reject`: A function you call when the asynchronous operation fails. The argument passed to `reject` (e.g., `new Error(...)`) will be the reason for failure.
    *   `setTimeout(() => { ... }, durationMs)`: This standard JavaScript function simulates a delay. After `durationMs`, the callback function inside `setTimeout` is executed.
    *   Inside the `setTimeout` callback, we check if `durationMs` is valid. If not, we `reject` the promise. Otherwise, we `resolve` it with a success message.

2.  **Calling with `.then().catch().finally()`**
    *   `simulateAsyncTask(...).then(successCallback)`: The `successCallback` function is executed if and when the promise resolves. It receives the value passed to `resolve()`.
    *   `.catch(errorCallback)`: The `errorCallback` function is executed if and when the promise is rejected. It receives the value passed to `reject()`.
    *   `.finally(cleanupCallback)`: The `cleanupCallback` is executed after the promise is settled (either resolved or rejected). It's useful for cleanup tasks.
    *   **Chaining**: You can chain `.then()` calls. If a `.then()` callback returns a new promise, the next `.then()` in the chain will wait for that new promise to resolve.

3.  **Calling with `async/await`**
    *   `async function runTasksWithAsyncAwait() { ... }`: The `async` keyword before a function declaration allows you to use `await` inside it. An `async` function implicitly returns a Promise.
    *   `const result = await simulateAsyncTask(...)`: The `await` keyword pauses the execution of `runTasksWithAsyncAwait` until the `simulateAsyncTask` promise settles.
        *   If the promise resolves, `await` returns the resolved value (which is then assigned to `result`).
        *   If the promise rejects, `await` throws the rejected value (error).
    *   `try...catch...finally`: This standard JavaScript error handling mechanism is used with `async/await` to handle rejected promises.
        *   The `try` block contains the `await` calls.
        *   The `catch` block catches any errors thrown by `await` (i.e., rejected promises).
        *   The `finally` block works just like with synchronous code.

`async/await` is generally preferred for writing asynchronous code as it often makes the code look and behave more like synchronous code, which can be easier to read and reason about, especially for complex sequences of asynchronous operations.+