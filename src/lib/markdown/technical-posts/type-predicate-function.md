---
title: Type predicate function
description: Type predicate function
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
```typescript
type NonNegativeNumber = number;

function isValidNonNegativeNumber(num: number): num is NonNegativeNumber {
    return typeof num === "number" && num >= 0;
}

// Example usage:

let age: NonNegativeNumber = 25; // Valid
let count: NonNegativeNumber = 0; // Valid
// let height: NonNegativeNumber = -5; // Invalid, TypeScript won't catch this directly

function processAge(age: number): void {
    // or NonNegativeNumber to restrict input
    if (isValidNonNegativeNumber(age)) {
        console.log(`Age is: ${age}`);
    } else {
        console.log("Invalid age.  Age must be a non-negative number.");
    }
}

processAge(30); // Output: Age is: 30
processAge(0); // Output: Age is: 0
processAge(-5); // Output: Invalid age.  Age must be a non-negative number.
```

**Explanation:**

1. **`type NonNegativeNumber = number;`:** This creates a _type alias_. It doesn't create a completely new type, but it gives the existing `number` type a more descriptive name ( `NonNegativeNumber`). This improves readability. However, TypeScript's type system at runtime is based on the underlying types of the variables. At runtime, there are only numbers in this case.

2. **`isValidNonNegativeNumber(num: number): num is NonNegativeNumber`:** This is a _type predicate function_. This is the crucial part. It allows us to perform runtime validation and inform the TypeScript compiler that a particular variable is actually of the `NonNegativeNumber` type after the validation succeeds.

    - `num: number`: The function accepts any number as input.
    - `num is NonNegativeNumber`: This is the type predicate syntax. It tells TypeScript that _if_ the function returns `true`, then the TypeScript compiler should treat the input `num` as being of type `NonNegativeNumber` within the scope where the function returned `true`.
    - Inside the function, `typeof num === 'number' && num >= 0` performs the runtime validation.

**Important Considerations:**

-   **Runtime vs. Compile Time:** TypeScript's type system is primarily for compile-time checking. At runtime, TypeScript code is usually converted to JavaScript, and JavaScript doesn't have static types in the same way. Therefore, using only `type NonNegativeNumber = number;` will not prevent you from assigning negative numbers at _runtime_. The type predicate ensures this.

-   **Runtime Validation is Essential:** You _must_ perform runtime validation (like the `isValidNonNegativeNumber` function) if you need to enforce the "non-negative" constraint at runtime. The type system helps catch errors early in development, but it can't guarantee that a variable will always be non-negative at runtime (especially if data comes from external sources, user input, or other untyped code).

-   **Alternative (Limited) Approaches:** You could consider using libraries like `io-ts` or `zod` for more sophisticated runtime type checking and validation. These libraries provide ways to define types with validation rules that are enforced at runtime. However, they usually involve more overhead than a simple type predicate function.