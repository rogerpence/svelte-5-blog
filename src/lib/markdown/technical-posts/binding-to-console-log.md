---
title: Binding to console log
description: Binding to console log
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
You've hit upon a very interesting and useful JavaScript technique! Let's break down `const log = console.log.bind(console);` and explain the `bind` method.

**Understanding `console.log`**

-   `console.log` is a method (a function that belongs to an object) provided by the JavaScript `console` object (available in browsers and Node.js).
-   Its purpose is to write messages to the console (for debugging, logging, etc.).
-   When you call `console.log("Hello")`, `console.log` is executed _in the context of_ (or with the `this` value set to) the `console` object.

**The `bind()` Method**

-   `bind()` is a method that is available on **all functions** in JavaScript.
-   It creates a **new** function whose `this` value is permanently bound to a specific value.
-   The syntax is `function.bind(thisArg, arg1, arg2, ...)`.
    -   `thisArg`: The value that will be used as the `this` value when the new function is called.
    -   `arg1`, `arg2`, ...: Optional arguments that will be prepended to the arguments that are provided when the new function is called.

**Putting It Together: `const log = console.log.bind(console);`**

Let's break it down step-by-step:

1.  **`console.log.bind()`**: This calls the `bind()` method on the `console.log` function.
2.  **`console`**: This is the first argument passed to `bind()`. It means that when the new function is called, its `this` value will be set to the `console` object.
3.  **`console.log.bind(console)`**: This creates a new function whose `this` value will always be the `console` object.
4.  **`const log = ...`**: This assigns that _new_ function to the constant variable named `log`.

**Why Use `bind(console)`?**

-   **Context Consistency:** When you extract a method from an object, the `this` value might change in the context where you are using the method. For example:

    ```javascript
    const myLog = console.log;
    myLog("Hello"); // the this context of this function is not `console`, and will most likely throw an error
    ```

-   By using `bind(console)` we ensure that the method continues to operate on its object by ensuring that the context, the value of `this`, is always `console`.


    ```javascript
    const myBoundLog = console.log.bind(console)
     myBoundLog("Hello") // prints the message to the console, because the `this` value is `console`
    ```

-   **Shorthand:** It provides a shorter, more convenient way to log messages, in the same way that `console.log` is.

**Example**

```typescript
const log = console.log.bind(console);

log("This is a log message"); // Output: This is a log message
log(1, 2, 3); // Output: 1 2 3
log({ message: "hello" }); // Output: { message: 'hello' }
```

In this case, `log` is now a function that you can use to call `console.log` from any part of your code with the appropriate `this` context.

**In the Context of the Code**

The `const log = console.log.bind(console);` line from the previous example _was_ intended to create a shorter variable to log messages, which I ended up removing when I re-worked the file. This line would have made it so you could log a message by just writing `log("my message")`, rather than `console.log("my message")`. The context of the `console.log` method was bound using the `bind` method, to ensure that the `console.log` function had its proper context. I apologize for leaving that line out.

Let me know if you have any more questions. I'm happy to help!