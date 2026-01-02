---
title: Rust mutable references
description: Rust mutable references
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
## Question

The first call to `get_file_lines` needs to be like this:

```
get_file_lines(&full_filename, &mut lines)?;
```

but the recursive call needs to be like this:

```
get_file_lines(&include_filename, lines)?;
```

why is the `&mut` omitted in the recursive call

## Answer

The reason you omit the `&mut` in the recursive call is that **Rust automatically handles the `&mut` borrow** when passing the `lines` vector. Both calls are effectively the same, but since `lines` is already borrowed mutably (`&mut Vec<String>`), you don’t need to re-specify the `&mut` keyword in the recursive call.

Let’s break it down:

### 1. **Initial Call to `get_file_lines`**:

When you first call `get_file_lines` like this:

```rust
get_file_lines(&full_filename, &mut lines)?;
```

-   `&mut lines` explicitly borrows the `lines` vector mutably for the first time. This is required because you're allowing the function to **modify** the vector (push new lines to it).
-   After the first mutable borrow, `lines` is now being passed around as a mutable reference for as long as it is borrowed.

### 2. **Recursive Call**:

The recursive call looks like this:

```rust
get_file_lines(&include_filename, lines)?;
```

-   **Notice that** you're passing `lines` without `&mut`. This works because **`lines` is already a mutable reference**. Inside the function, you're working with a `&mut Vec<String>`, and Rust doesn't require you to re-borrow a mutable reference that is already being passed around.

### Why does Rust allow this?

-   When you pass `lines` without `&mut`, Rust still recognizes that it's a mutable reference (`&mut Vec<String>`) because the function signature expects it.
-   If `lines` is already borrowed mutably, the compiler knows you're still working with that mutable reference and doesn't need you to explicitly mark it as `&mut` again.

### Function Signature:

```rust
fn get_file_lines(full_filename: &str, lines: &mut Vec<String>) -> io::Result<()> {
```

-   The function signature clearly expects `lines` to be a `&mut Vec<String>`, so when you pass `lines` recursively, it already knows it's a mutable reference.

### Example:

Here’s a quick example to illustrate this point:

```rust
fn main() {
    let mut numbers = vec![1, 2, 3];
    add_to_vec(&mut numbers);
    println!("{:?}", numbers);  // Output: [1, 2, 3, 4, 5]

    // Recursive call, no need for &mut again
    add_to_vec(numbers);
}

fn add_to_vec(v: &mut Vec<i32>) {
    v.push(4);
    // Recursive call, 'v' is already a mutable reference
    if v.len() < 5 {
        add_to_vec(v);
    } else {
        v.push(5);
    }
}
```

### Key Takeaways:

-   **Initial borrow**: You need to use `&mut` to borrow the `lines` vector mutably for the first call.
-   **Subsequent uses**: Once `lines` is borrowed mutably, you don't need to re-specify `&mut` in recursive calls because Rust knows you're passing a mutable reference.