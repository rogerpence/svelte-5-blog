---
title: What is a crate in Rust
description: What is a crate in Rust
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
In Rust, a **crate** is a package of Rust code. It can be a binary crate, which is an executable program, or a library crate, which provides functionality that can be used by other crates. Here’s a more detailed breakdown:

### Types of Crates

1. **Binary Crate**:

    - Contains a `main` function and can be compiled into an executable.
    - You run it with `cargo run`.
    - Examples: command-line tools, applications.

2. **Library Crate**:
    - Does not contain a `main` function.
    - Provides functionality through its public API for use in other crates.
    - You include it in your project using `Cargo.toml`.
    - Examples: utility libraries, frameworks.

### Crate Structure

A crate has the following structure:

-   **`Cargo.toml`**: The configuration file where you define dependencies, metadata, and other settings for your crate.
-   **`src/lib.rs`**: For library crates, this is where you define the crate’s public API.
-   **`src/main.rs`**: For binary crates, this is where the `main` function resides.

### Creating and Using Crates

-   **Creating a Crate**:
    Use `cargo new crate_name` to create a new crate. By default, it creates a binary crate with a `main` function.
-   **Using External Crates**:
    Add dependencies to your `Cargo.toml` to use external crates. For example:

    ```toml
    [dependencies]
    regex = "1"
    ```

-   **Using Crates in Code**:
    Import and use functions or types from external crates with `use` statements. For example:

    ```rust
    use regex::Regex;

    fn main() {
        let re = Regex::new(r"^\d+$").unwrap();
        println!("{}", re.is_match("123")); // true
    }
    ```

### Example

Here’s a minimal example of a library crate:

-   **Cargo.toml**:

    ```toml
    [package]
    name = "my_library"
    version = "0.1.0"
    edition = "2021"

    [dependencies]
    ```

-   **src/lib.rs**:
    ```rust
    pub fn greet(name: &str) -> String {
        format!("Hello, {}!", name)
    }
    ```

To use this library crate in another project:

1. Add it to `Cargo.toml` as a dependency:

    ```toml
    [dependencies]
    my_library = { path = "../my_library" }
    ```

2. Use it in your code:

    ```rust
    use my_library::greet;

    fn main() {
        println!("{}", greet("World"));
    }
    ```

Understanding crates is fundamental to Rust development, as they help organize code into manageable pieces and facilitate code reuse.