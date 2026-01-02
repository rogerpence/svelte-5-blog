---
title: Understanding Rust's unwrap function
description: Understanding Rust's unwrap function
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
## Question

What is unwrap doing in this line of Rust:

```
let re = Regex::new(r"^\s*#include\s+").unwrap();
```

## Answer

In Rust, the `unwrap()` method is used to extract the value from a `Result` or `Option` type, assuming that it contains a value. In your example:

```rust
let re = Regex::new(r"^\s*#include\s+").unwrap();
```

Here's what's happening:

1. `Regex::new(r"^\s*#include\s+")` attempts to create a new regex pattern. This function returns a `Result<Regex, RegexError>`, which means it could either succeed (returning a `Regex`) or fail (returning an error).

2. By calling `unwrap()`, you're saying, "I expect this operation to succeed, and if it doesn't, panic (crash) the program and print the error message."

Using `unwrap()` is convenient for quick prototyping or in situations where you're sure the operation will succeed, but in production code, it's generally better to handle errors more gracefully, such as using `match` or `if let` to manage potential failures.