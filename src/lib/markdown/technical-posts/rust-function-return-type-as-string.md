---
title: Rust function return type as string
description: Rust function return type as string
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
If you want a function to return a `String`, you would typically use the `String` type as the return type. Here’s how you can define such a function:

### Example

```rust
fn greeting(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    let name = "Alice";
    let message = greeting(name);
    println!("{}", message);
}
```

### When to Use `String`

You would use a `String` return type in scenarios where:

-   You are generating or constructing a string value that will be used later.
-   The function is expected to return a string representation of some data or computation.

### Considerations for Error Handling

If the function might encounter errors while generating the string (for example, when reading from a file or performing operations that can fail), it's often better to use a `Result<String, E>` return type. This way, you can indicate success or failure while also providing an error message.

### Example with `Result`

```rust
use std::fs;
use std::io::{self, ErrorKind};

fn read_file_contents(file_path: &str) -> Result<String, io::Error> {
    let contents = fs::read_to_string(file_path)?;
    Ok(contents)
}

fn main() {
    match read_file_contents("some_file.txt") {
        Ok(contents) => println!("File contents:\n{}", contents),
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}
```

### Summary

-   Use `String` as the return type when the function is simply returning a string value.
-   Use `Result<String, E>` when you need to handle potential errors along with returning a string, allowing for more robust error handling and better feedback to the caller.