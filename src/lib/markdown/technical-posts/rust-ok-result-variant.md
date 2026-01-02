---
title: Rust's OK result variant
description: Rust's OK result variant
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
In Rust, the reason `Ok(())` requires two sets of parentheses is due to the type system and the distinction between **unit type** (`()`) and the result type.

### Key Points:

1. **Unit Type `()`**:

    - The unit type `()` in Rust represents "nothing" or "void", similar to `void` in other languages. It’s often used to indicate that a function doesn’t return a value or that there’s no meaningful result.
    - When a function returns `()` (e.g., `fn my_function() -> () {}`), it signifies that the function doesn't return anything.

2. **`Result<T, E>` Type**:
    - In Rust, `Result<T, E>` is used to represent a result that can be either `Ok(T)` for success or `Err(E)` for failure.
    - The `Ok` variant contains a value of type `T`. The `Err` variant contains a value of type `E`.

### `Ok(())` Explained:

-   `Ok(())` means the function succeeded and it returns an `Ok` variant containing the **unit type** `()`, signifying no actual value is being returned.
-   `Ok()` would not compile because `Ok` requires an argument — in this case, it’s returning `()` to explicitly indicate a successful result without any associated value.

### Example Breakdown:

In your `main` function, you return `io::Result<()>`:

```rust
fn main() -> io::Result<()> {
    // your code
    Ok(())
}
```

Here’s what's happening:

-   The return type is `io::Result<()>`, meaning it expects either:
    -   `Ok(())` on success, where `()` is the unit type (indicating the function succeeded without returning a meaningful value).
    -   Or `Err(e)` on failure, where `e` is some error type (e.g., `io::Error`).

Since your `main` function doesn’t need to return any actual value but you want to indicate it completed successfully, you return `Ok(())`.

### Summary:

-   `Ok(())` means the function succeeded and there is no meaningful value to return.
-   The `()` inside `Ok` is the unit type, which signifies "nothing" or "void". The outer `Ok` indicates success in the `Result` type.

Let me know if you'd like further clarification on Rust's type system!


[[Read a text file with Rust#What is `Ok(lines)` doing? | Read a text file with Rust]]

No, `Ok` is not a method, but rather a **variant** of the `Result` enum in Rust.

> [!info]
> When you write `Ok(value)`, you are creating an instance of the `Result` enum where the operation was successful, and the value of `T` is contained inside `Ok`.

### Explanation of `Result` Enum:

In Rust, `Result` is an enum defined in the standard library with two variants:

-   **`Ok(T)`**: Represents a successful result, containing a value of type `T`.
-   **`Err(E)`**: Represents a failure or error, containing a value of type `E`.

Here’s a simplified version of how `Result` is defined in Rust:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### `Ok` as a Variant:

-   **`Ok`** is a variant of the `Result` enum, not a method. It’s used to indicate that the result of an operation is successful.
-   When you write `Ok(value)`, you are creating an instance of the `Result` enum where the operation was successful, and the value of `T` is contained inside `Ok`.

### Example:

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(a / b) // Ok variant contains the result of the division
    }
}
```

In this example:

-   If the division is successful, `Ok(a / b)` is returned.
-   If an error occurs (like dividing by zero), `Err("...")` is returned.

## Summary:

-   `Ok` is a variant of the `Result` enum, not a method.
-   It’s used to signify the successful result of an operation in a `Result<T, E>` type, containing the value of type `T`.

# Is OK(()) like returning `void` in C?

Yes, `Ok(())` in Rust is conceptually similar to returning `void` in C, but with some key differences due to Rust's type system and the use of the `Result` enum.

### Comparison to C’s `void`:

-   **In C**: A function that returns `void` does not return any value, indicating that no meaningful result is expected. For example:

    ```c
    void my_function() {
        // Do something, but no return value
    }
    ```

-   **In Rust**: The unit type `()` represents "nothing" or "no meaningful value," which is the equivalent of `void` in C. A function can return `()` when it has no value to return. However, in Rust, `Ok(())` is often used when a function that returns a `Result` needs to indicate success, but with no specific value.

    Example:

    ```rust
    fn my_function() -> () {
        // Do something, but no return value
    }
    ```

### `Ok(())` in Rust:

-   `Ok(())` is used in functions that return `Result<(), E>`, where `()` signifies that the function succeeded, but there is no value to return.
-   It combines the idea of a successful operation (`Ok`) with the concept of returning "nothing" (`()`).

For example:

```rust
fn perform_operation() -> Result<(), String> {
    // Perform some operation
    if success {
        Ok(()) // Indicates success without returning any meaningful value
    } else {
        Err(String::from("Operation failed"))
    }
}
```

### Key Differences Between C's `void` and Rust's `Ok(())`:

1. **C's `void`**: Used in functions that don’t return a value. It doesn’t provide any context about success or failure.
2. **Rust's `Ok(())`**: Indicates that an operation succeeded (due to the `Ok` variant of `Result`) but has no value to return (represented by `()`).

    - **`Ok`** indicates success, similar to how `0` might be returned in C for success.
    - **`Err(E)`** indicates failure and holds an error value of type `E`.

### Summary:

-   **`Ok(())`** is similar to returning `void` in C but with the added advantage of Rust's `Result` type, which allows functions to return an indication of success or failure.
-   It provides better type safety and error handling than a `void` function in C.