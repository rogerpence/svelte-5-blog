---
title: What does Rust's 'mut' keyword do
description: What does Rust's 'mut' keyword do
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
In Rust, `mut` is a keyword used to declare that a variable is mutable, meaning that its value can be changed after it is initially set.

### Detailed Explanation:

-   **`let`**: This keyword is used to declare a variable in Rust.
-   **`mut`**: This keyword is used to indicate that the variable's value can be modified. Without `mut`, the variable is immutable, meaning its value cannot be changed once it's assigned.

### In Your Example:

```rust
let mut lines = Vec::new();
```

Here’s what each part means:

1. **`let`**: Declares a new variable named `lines`.
2. **`mut`**: Indicates that the variable `lines` is mutable, so you can modify its contents or reassign it.
3. **`lines`**: The name of the variable.
4. **`Vec::new()`**: Creates a new, empty vector of the default type `Vec<T>`. The specific type of `T` would be inferred from the context or explicitly defined elsewhere in the code.

### Why Use `mut`?

In Rust, variables are immutable by default. This immutability helps to prevent unintended side effects and makes code more predictable and safer. However, if you need to change the value of a variable, you must explicitly mark it as mutable using `mut`.

For example, if you have a mutable vector:

```rust
let mut lines = Vec::new(); // Create a mutable vector
lines.push("First line".to_string()); // Modify the vector by adding an element
lines.push("Second line".to_string()); // Modify the vector by adding another element
```

In this case:

-   `lines.push(...)` is allowed because `lines` is mutable. If you had declared `lines` without `mut`, trying to call `push` would result in a compile-time error.

### Immutable Variable Example:

If you declared `lines` without `mut`:

```rust
let lines = Vec::new(); // Create an immutable vector
// lines.push("Some line".to_string()); // This would cause a compile-time error
```

-   Here, `lines` cannot be modified or reassigned. Any attempt to call methods that mutate the vector, like `push`, would result in an error.

### Summary:

-   **`mut`** allows a variable to be modified after it is initialized.
-   In your example, `let mut lines = Vec::new();` creates a mutable vector that can be modified by adding elements or performing other mutations.
-   Without `mut`, the variable would be immutable, and any attempts to change its value would result in a compile-time error.