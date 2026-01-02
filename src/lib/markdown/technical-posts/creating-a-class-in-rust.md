---
title: Creating a class in Rust
description: Creating a class in Rust
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
In Rust, you create a new class using the `struct` keyword, which defines a structure that can contain fields. You can then implement methods for the struct using the `impl` keyword. Here's a basic example of creating a new struct (class) in Rust:

### Example: Creating a Struct

Let's create a simple `Rectangle` struct with fields for width and height, and implement methods to calculate the area and perimeter.

```rust
// Define the Rectangle struct
struct Rectangle {
    width: f64,
    height: f64,
}

// Implement methods for Rectangle
impl Rectangle {
    // Method to calculate area
    fn area(&self) -> f64 {
        self.width * self.height
    }

    // Method to calculate perimeter
    fn perimeter(&self) -> f64 {
        2.0 * (self.width + self.height)
    }
}

fn main() {
    // Create a new instance of Rectangle
    let rect = Rectangle {
        width: 5.0,
        height: 3.0,
    };

    // Call the methods
    println!("Area: {}", rect.area());
    println!("Perimeter: {}", rect.perimeter());
}
```

### Explanation

1. **Struct Definition**:

    - The `struct Rectangle` defines a new data structure with two fields: `width` and `height`, both of type `f64`.

2. **Implementing Methods**:

    - The `impl Rectangle` block is where we define methods associated with the `Rectangle` struct.
    - The `&self` parameter is a reference to the instance of the struct, allowing access to its fields.

3. **Creating an Instance**:

    - In the `main` function, we create an instance of `Rectangle` with specific width and height values.

4. **Using Methods**:
    - We call the `area` and `perimeter` methods on the `rect` instance to get the area and perimeter of the rectangle.

### Summary

In Rust, structs serve a similar purpose to classes in other languages, allowing you to group related data together. You can define methods on structs to encapsulate behavior, promoting code organization and reusability.