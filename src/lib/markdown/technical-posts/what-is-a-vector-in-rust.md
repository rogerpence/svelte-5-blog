---
title: What is a vector in Rust
description: What is a vector in Rust
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
## What is a `vector` in Rust

In Rust, a **vector** (`Vec<T>`) is a growable, heap-allocated, dynamic array. It is a collection type that stores elements of the same type `T` and allows you to store multiple values in a single data structure. Vectors are one of the most commonly used types in Rust for managing collections of data, especially when the size of the collection is not known at compile time.

### Key Characteristics of Vectors:

1. **Dynamic size**: Unlike arrays, which have a fixed size, vectors can grow or shrink as needed.
2. **Heap allocation**: Vectors store their data on the heap (as opposed to the stack), which allows them to resize dynamically.
3. **Homogeneous**: All elements in a vector must be of the same type `T`.
4. **Efficient indexing**: Vectors support fast indexing and iteration over the elements.

### Common Operations on Vectors:

-   **Creation**: You can create an empty vector or one initialized with specific values.
-   **Push/Pop**: You can add elements to the end of a vector or remove them.
-   **Indexing**: You can access elements by their index (zero-based).

### Example Usage:

```rust
fn main() {
    // Creating a new empty vector
    let mut v: Vec<i32> = Vec::new();

    // Adding elements to the vector
    v.push(1);
    v.push(2);
    v.push(3);

    // Accessing elements by index
    println!("First element: {}", v[0]);

    // Iterating over the vector
    for i in &v {
        println!("{}", i);
    }

    // Removing the last element (pop)
    v.pop();
}
```

### Key Functions for Vectors:

-   **`Vec::new()`**: Creates an empty vector.
-   **`Vec::with_capacity(n)`**: Creates a vector with pre-allocated capacity for `n` elements.
-   **`.push(value)`**: Adds an element to the end of the vector.
-   **`.pop()`**: Removes and returns the last element of the vector (or `None` if it's empty).
-   **`.len()`**: Returns the number of elements in the vector.
-   **`.is_empty()`**: Checks if the vector is empty.
-   **`.get(index)`**: Returns an `Option<&T>` for safe element access.

### Memory Safety:

-   Rust ensures memory safety with vectors by automatically managing memory. When a vector goes out of scope, its memory is freed, avoiding issues like memory leaks.
-   Rust prevents out-of-bounds access with vectors. For example, accessing an invalid index will panic at runtime (in debug mode), and using `.get()` returns an `Option` to safely handle out-of-bounds access.

### Example of Safe Access:

```rust
fn main() {
    let v = vec![1, 2, 3];

    match v.get(2) {
        Some(value) => println!("Found: {}", value),
        None => println!("Out of bounds!"),
    }
}
```

In this case, `v.get(2)` safely checks if index 2 exists and handles it accordingly.