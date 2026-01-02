---
title: What does the Rust ? operator do
description: What does the Rust ? operator do
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
The question mark (`?`) operator in Rust is used to propagate errors in functions that return a `Result` or `Option`. It simplifies error handling by avoiding explicit `match` statements.

### Explanation:

When you use `?` at the end of an expression like:

```rust
let file = File::open(file_path)?;
```

It is shorthand for:

1. **Check if the operation succeeds**: If the result is `Ok`, the value inside `Ok` is returned.
2. **Propagate the error**: If the result is `Err`, the function immediately returns the `Err` without further execution.

### Breakdown:

-   `File::open(file_path)` returns a `Result<File, io::Error>`.
    -   If the file is successfully opened, the `Result` contains `Ok(file)`, and `file` is assigned to the variable.
    -   If the file cannot be opened (e.g., the file doesn't exist), it returns an `Err(io::Error)`.

The `?` operator handles the `Result`:

-   If it's `Ok(file)`, the value is returned, and the program continues.
-   If it's `Err(e)`, the function that contains this line will return `Err(e)` immediately, propagating the error upwards.

### Example without `?`:

If you were to write this explicitly without `?`, it would look like:

```rust
let file = match File::open(file_path) {
    Ok(file) => file,
    Err(e) => return Err(e),
};
```

Using `?` simplifies this to a single line, improving readability. The function using `?` must return a `Result` (or `Option` if using `?` with `Option`).