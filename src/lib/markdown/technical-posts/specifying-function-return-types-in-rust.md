---
title: Specifying function return types in Rust
description: Specifying function return types in Rust
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
In Rust, you specify the return value of a function by declaring the return type after the function signature using the `->` symbol. The value that you want to return is typically placed as the last expression in the function body, without a semicolon. If you include a semicolon, it turns the expression into a statement, which does not return a value.

### Basic Syntax:

```rust
fn function_name(arguments) -> ReturnType {
    // Function body

    // The last expression (without a semicolon) is the return value
    value_to_return
}
```

### Example:

```rust
fn add(a: i32, b: i32) -> i32 {
    // This returns the sum of a and b
    a + b // No semicolon here, so this is the return value
}
```

-   **`-> i32`**: This specifies that the return type of the function is an `i32`.
-   **`a + b`**: This is the last expression, and since it doesn't have a semicolon, it becomes the return value of the function.

### Explicit Return with `return`:

You can also explicitly return a value using the `return` keyword. This is more common in conditional or early return cases but can be used at any point in the function.

```rust
fn add(a: i32, b: i32) -> i32 {
    return a + b; // Explicitly returning a value using `return`
}
```

### Example with Conditional Return:

```rust
fn check_value(x: i32) -> bool {
    if x > 10 {
        return true; // Early return
    }

    false // Implicit return (last expression)
}
```

In this case, `true` is returned if `x > 10`, and if the condition is not met, `false` is returned as the last expression of the function.

### Functions with No Return Value:

If a function doesn't return a value, its return type is `()` (unit), which is the default return type if none is specified.

```rust
fn greet() {
    println!("Hello, world!"); // No return type needed
}
```

In this case, the function doesn't return anything, so you don't need to explicitly specify a return type.

## What does Rust's `match` statement do

In Rust, the `match` statement is used for pattern matching, allowing you to handle different possible values and states of an enum or other types. In the provided code, `match` is used to handle the result of reading each line from the `reader`.

Here's what `match` does in this context:

```rust
for line in reader.lines() {
    // Match on the result of reading the line
    match line {
        // If successful, push the line's content into the vector
        Ok(content) => lines.push(content),
        // If there's an error, print an error message to standard error
        Err(e) => eprintln!("Error reading line: {}", e),
    }
}
```

### Breakdown:

1. **`reader.lines()`**:

    - This returns an iterator where each item is a `Result<String, io::Error>`.
    - `Result<String, io::Error>` is an enum that can be either:
        - `Ok(String)`: Indicates a successful read operation, where `String` is the content of the line.
        - `Err(io::Error)`: Indicates an error during reading, where `io::Error` describes what went wrong.

2. **`match line`**:

    - `match` is used to destructure and handle the different possible states of the `Result`.

3. **Patterns**:
    - **`Ok(content)`**: This pattern matches when the `line` is a successful result. Here, `content` is the string value read from the line. In this case, the code executes `lines.push(content)`, which adds the line to the `lines` vector.
    - **`Err(e)`**: This pattern matches when the `line` is an error. Here, `e` is the `io::Error` describing what went wrong. The code executes `eprintln!("Error reading line: {}", e)`, which prints an error message to standard error.

### Summary:

-   The `match` statement is used to handle both possible outcomes of reading a line:
    -   **On Success (`Ok`)**: Add the line to the `lines` vector.
    -   **On Error (`Err`)**: Print an error message to the standard error stream.

This approach ensures that both successful and unsuccessful attempts to read lines are appropriately handled.