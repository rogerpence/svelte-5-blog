---
title: Rust concept of borrowing a value
description: Rust concept of borrowing a value
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
In Rust, borrowing is a key concept that enables memory safety and concurrency without a garbage collector. It allows you to refer to a value without taking ownership of it, meaning you can access or use data without moving it. This is crucial for ensuring that multiple parts of a program can use the same data safely.

### Key Concepts of Borrowing

1. **References**:

    - Borrowing is done through references, which are created using the `&` symbol for immutable references and `&mut` for mutable references.
    - An immutable reference allows read access to the value, while a mutable reference allows both read and write access.

2. **Ownership Rules**:

    - You can have either multiple immutable references (`&T`) or a single mutable reference (`&mut T`) to a value at any time, but not both. This prevents data races at compile time.

3. **Lifetime**:
    - References have lifetimes, which are annotations that tell the Rust compiler how long a reference is valid. The compiler checks that references do not outlive the data they point to.

### Examples

#### Immutable Borrowing

Here’s an example of immutable borrowing:

```rust
fn main() {
    let s = String::from("Hello, world!");

    let len = calculate_length(&s); // Borrowing `s`

    println!("The length of '{}' is {}.", s, len);
}

fn calculate_length(s: &String) -> usize {
    s.len() // Read-only access to `s`
}
```

In this example:

-   The `calculate_length` function borrows `s` as an immutable reference. The original owner of `s` (in `main`) can still use `s` after the borrowing.

#### Mutable Borrowing

Here’s an example of mutable borrowing:

```rust
fn main() {
    let mut s = String::from("Hello");

    change(&mut s); // Borrowing `s` as mutable

    println!("{}", s);
}

fn change(s: &mut String) {
    s.push_str(", world!"); // Modifying the borrowed value
}
```

In this example:

-   The `change` function borrows `s` as a mutable reference. After this borrowing, no other references (mutable or immutable) can access `s` until the borrowing ends.

### Benefits of Borrowing

-   **Memory Safety**: By enforcing strict rules on ownership and borrowing, Rust prevents common bugs related to dangling pointers, data races, and memory leaks at compile time.
-   **Performance**: Borrowing avoids unnecessary data copying, allowing for efficient use of resources.

### Conclusion

Borrowing is a fundamental concept in Rust that allows for safe and efficient management of memory. By using references, Rust enforces strict ownership rules, ensuring that data is accessed and modified in a way that prevents bugs and enhances performance. Understanding borrowing is crucial for mastering Rust and writing safe, concurrent applications.