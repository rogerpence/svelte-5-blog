---
title: An explanation of using Rust unusual match function call.
description: An explanation of using Rust unusual match function call.
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
Rust has unusual function calls.

```
match extract_numbers_from_filename(filename) {
	Some(result) => println!("Extracted: {}", result),
	None => eprintln!("No valid number series found in the file name"),
}
```

The function call you are referring to is a **match expression** in Rust. It is used to handle different possible outcomes of the `extract_numbers_from_filename(filename)` function, which returns an `Option<String>` (either `Some(String)` or `None`). Here's a breakdown of the components and how it works:

### 1. **Function Call: `extract_numbers_from_filename(filename)`**

-   This calls the function `extract_numbers_from_filename`, passing the `filename` (a string slice `&str`) as an argument.
-   The function tries to extract a series of numbers from the filename using a regular expression.
-   It returns an `Option<String>`, which is an enum that can either be:
    -   `Some(String)` — representing success, where the `String` contains the extracted and formatted numbers.
    -   `None` — representing failure, where no valid number series was found in the file name.

### 2. **Match Expression: `match extract_numbers_from_filename(filename)`**

-   The `match` expression in Rust is used to branch the control flow based on the value returned by `extract_numbers_from_filename`.
-   The expression takes the return value (`Option<String>`) and checks which variant it matches: `Some` or `None`.

### 3. **Matching on `Option`:**

The return value of the function is an `Option<String>`. Here’s what happens in detail:

#### `Some(result) =>`

-   If the function returns `Some(result)`, this means the regex was successful, and `result` is the `String` containing the extracted number sequence.
-   In this case, the `result` (the string inside the `Some` variant) is bound to the variable `result`.
-   The arrow `=>` directs the program to execute the following block:
    ```rust
    println!("Extracted: {}", result);
    ```
    This line prints the extracted number sequence, replacing `{}` with the value of `result`. For example:
    ```
    Extracted: 12.45.678.99
    ```

#### `None =>`

-   If the function returns `None`, it means that no valid number sequence was found in the filename.
-   In this case, the `None` variant is matched, and the arrow `=>` directs the program to execute the following block:
    ```rust
    eprintln!("No valid number series found in the file name");
    ```
    This prints an error message to the standard error stream (i.e., it prints an error message to the terminal). `eprintln!` is similar to `println!`, but it writes to the standard error.

### 4. **Putting It All Together:**

Here’s the complete breakdown of the match expression:

```rust
match extract_numbers_from_filename(filename) {
    Some(result) => println!("Extracted: {}", result),
    None => eprintln!("No valid number series found in the file name"),
}
```

-   **`extract_numbers_from_filename(filename)`**: Calls the function to extract numbers from the filename.
-   **`match`**: The returned value is matched against the two possible variants of `Option<String>`:
    -   **`Some(result)`**: If the function successfully extracted the numbers, `result` contains the formatted string, and it’s printed using `println!`.
    -   **`None`**: If the function failed to extract numbers, it matches `None`, and an error message is printed using `eprintln!`.

### Why Use `Option`?

Rust uses `Option` as a type-safe way of dealing with cases where a value might be absent. It forces you to explicitly handle both the `Some` and `None` cases, ensuring that you don’t accidentally use a value that might not exist. The `match` expression is the common way of unwrapping an `Option` and handling both possible outcomes.

### Example:

Suppose you run the program with the filename `"file 0012.0034.0567.0789.txt"`, the `extract_numbers_from_filename` function might return `Some("12.34.567.789".to_string())`. In that case, the match expression would execute the first arm (`Some(result)`) and print:

```
Extracted: 12.34.567.789
```

If the filename doesn’t contain the number pattern (e.g., `"file.txt"`), the function would return `None`, and the match expression would execute the second arm (`None`) and print an error message:

```
No valid number series found in the file name
```

## Alternatives to using `match` to call Rust functions

In Rust, the primary way to execute code is by calling functions. However, there are several alternative ways of defining and executing code besides traditional function calls, depending on the context and what you're trying to achieve. Let's explore some alternatives:

### 1. **Closures (Anonymous Functions)**

Closures are anonymous functions that can capture variables from their surrounding environment. You can define and execute a closure without explicitly defining a named function.

Example of a closure:

```rust
fn main() {
    let add = |x: i32, y: i32| x + y;
    let result = add(5, 10); // This is calling the closure
    println!("The result is: {}", result);
}
```

In this case, `add` is a closure that behaves like a function but is defined inline without a name.

Closures are commonly used in Rust for things like iterators, functional programming patterns, and passing behavior around (e.g., passing a closure to another function).

### 2. **Macros**

Macros in Rust allow you to define code that writes other code. They’re a way to abstract over code patterns, and they are invoked differently from functions, using `!`.

Example of a macro:

```rust
fn main() {
    println!("Hello, world!"); // println! is a macro, not a function
}
```

You can define your own macros as well:

```rust
macro_rules! say_hello {
    () => {
        println!("Hello, world!");
    };
}

fn main() {
    say_hello!(); // This invokes the macro
}
```

Macros are powerful because they work on the abstract syntax tree level, meaning they can generate complex code at compile time.

### 3. **Inline Code Blocks (`{}`)**

You can execute a block of code inline without needing a named function. Code blocks `{}` return the last expression implicitly.

Example:

```rust
fn main() {
    let result = {
        let x = 5;
        let y = 10;
        x + y // This value is returned from the block
    };

    println!("The result is: {}", result);
}
```

In this case, the block `{ let x = 5; let y = 10; x + y }` behaves similarly to a function but is evaluated inline and returns a value.

### 4. **Methods on Structs or Enums**

Instead of calling a free-standing function, you might define a method on a struct or enum and call it as an associated method.

Example:

```rust
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn distance_from_origin(&self) -> f64 {
        ((self.x.pow(2) + self.y.pow(2)) as f64).sqrt()
    }
}

fn main() {
    let p = Point { x: 3, y: 4 };
    println!("Distance: {}", p.distance_from_origin()); // Method call
}
```

Here, `distance_from_origin` is a method associated with the `Point` struct. You call it using the instance `p` as `p.distance_from_origin()`.

### 5. **Trait Implementations**

Instead of calling a specific function, you can invoke a method or behavior through trait implementations, which allow polymorphism.

Example:

```rust
trait Greet {
    fn greet(&self);
}

struct Person {
    name: String,
}

impl Greet for Person {
    fn greet(&self) {
        println!("Hello, {}!", self.name);
    }
}

fn main() {
    let person = Person { name: "Alice".to_string() };
    person.greet(); // Calls the method via the trait
}
```

Here, `greet` is a method from the `Greet` trait, and it's called on an instance of `Person` through polymorphism.

### 6. **Pattern Matching as an Alternative**

In some cases, instead of calling a function, you can handle logic using pattern matching. This can replace function calls that are based on conditional logic.

Example:

```rust
enum Message {
    Hello,
    Goodbye,
}

fn main() {
    let message = Message::Hello;

    match message {
        Message::Hello => println!("Hello!"),
        Message::Goodbye => println!("Goodbye!"),
    }
}
```

In this example, instead of calling a separate function to handle each message, pattern matching is used to directly handle the logic inline.


### Summary

While traditional functions are the most common way to encapsulate and reuse code in Rust, you have several alternatives, such as:

-   **Closures**: Inline anonymous functions that can capture their environment.
-   **Macros**: Used to generate code patterns at compile time.
-   **Inline code blocks**: Self-contained blocks that return values.
-   **Methods**: Functions associated with structs or enums.
-   **Traits**: Providing polymorphic behavior.
-   **Pattern Matching**: Handling logic directly in match expressions.

These alternatives give Rust a lot of flexibility in how you structure and execute code, depending on the specific context.