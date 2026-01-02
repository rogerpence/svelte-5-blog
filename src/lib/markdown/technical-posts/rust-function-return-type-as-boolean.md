---
title: A Rust function that returns a Boolean
description: A Rust function that returns a Boolean
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
If you want a function to return a boolean value indicating success or failure (or some condition), you would typically use the `bool` type as the return type. Here's how you can define such a function:

### Example

```rust
fn is_positive(number: i32) -> bool {
    number > 0
}

fn main() {
    let num = 5;
    if is_positive(num) {
        println!("{} is positive.", num);
    } else {
        println!("{} is not positive.", num);
    }
}
```

### When to Use `bool`

You would use a `bool` return type in cases where:

-   You need to check a condition, such as whether a value meets certain criteria (e.g., whether a number is positive, whether a string is empty, etc.).
-   The function's purpose is simply to evaluate a condition rather than perform an operation that may fail.

### Considerations

However, if the function might encounter errors or require more nuanced feedback, it's often better to use a `Result` type. For example, if you have a function that checks if a file exists, you might want to indicate success or failure while also providing an error message:

```rust
use std::fs;

fn file_exists(file_path: &str) -> Result<bool, std::io::Error> {
    match fs::metadata(file_path) {
        Ok(_) => Ok(true),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(false),
        Err(e) => Err(e),
    }
}

fn main() {
    match file_exists("some_file.txt") {
        Ok(exists) => {
            if exists {
                println!("The file exists.");
            } else {
                println!("The file does not exist.");
            }
        },
        Err(e) => eprintln!("Error checking file: {}", e),
    }
}
```

### Summary

-   Use `bool` for simple checks that return true or false.
-   Use `Result<bool, E>` when you need to handle potential errors alongside a boolean result, providing more context about failure conditions.