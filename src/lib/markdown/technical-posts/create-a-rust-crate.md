---
title: How to create and use a Rust crate
description: How to create and use a Rust crate
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
To package the `find_matching_files` function into its own reusable Rust crate, you can follow these steps:

### 1. Create a New Crate

First, you'll create a new Rust library crate. Run the following command:

```bash
cargo new find_files --lib
```

This will create a directory named `find_files` with the following structure:

```
find_files
├── Cargo.toml
└── src
    └── lib.rs
```

### 2. Modify `Cargo.toml`

Open the `Cargo.toml` file and modify the package metadata if needed. You will also need to add the `glob` crate as a dependency:

```toml
[package]
name = "find_files"
version = "0.1.0"
edition = "2021"

[dependencies]
glob = "0.3"
```

### 3. Implement the Function in `lib.rs`

In the `src/lib.rs` file, implement the `find_matching_files` function:

```rust
use glob::glob;
use std::path::Path;

pub fn find_matching_files(directory: &str, pattern: &str) -> Vec<String> {
    // Combine directory and pattern
    let full_pattern = format!("{}/{}", directory, pattern);

    let mut files = Vec::new();

    // Use glob to find matching files
    for entry in glob(&full_pattern).expect("Failed to read glob pattern") {
        match entry {
            Ok(path) => {
                if let Some(path_str) = path.to_str() {
                    files.push(path_str.to_string());
                }
            },
            Err(e) => eprintln!("Error matching file: {}", e),
        }
    }

    files
}

pub fn is_valid_directory(directory: &str) -> bool {
    Path::new(directory).is_dir()
}
```

In this version:

-   The `find_matching_files` function is public (`pub`) so that it can be reused in other projects.
-   Added `is_valid_directory` to check if a directory is valid, also made public (`pub`).

### 4. Build the Crate

To make sure everything is set up correctly, run the following command inside the `find_files` directory:

```bash
cargo build
```

### 5. Use the Crate in Another Project

You can now use this crate in another project by adding a dependency in the `Cargo.toml` of your main project. If you want to use the crate locally, add it as a path dependency:

```toml
[dependencies]
find_files = { path = "../find_files" }
```

If you want to specify a fully qualified path (absolute path) to the `find_files` crate in `Cargo.toml`, you can do so like this:

```rust
[dependencies]
find_files = { path = "/full/path/to/find_files" }
```

Replace `"/full/path/to/find_files"` with the actual path on your filesystem.

### Example Usage

In your main program, you can now use the `find_files` crate:

```rust
use find_files::{find_matching_files, is_valid_directory};
use std::env;
use std::fs::File;
use std::io::{self, Write};

fn write_to_file(file_path: &str, files: &[String]) -> io::Result<()> {
    let mut file = File::create(file_path)?;

    for file_name in files {
        writeln!(file, "{}", file_name)?;
    }

    Ok(())
}

fn main() {
    // Get command-line arguments
    let args: Vec<String> = env::args().collect();

    if args.len() != 4 {
        eprintln!("Usage: {} <directory> <pattern> <output_file>", args[0]);
        return;
    }

    let directory = &args[1];
    let pattern = &args[2];
    let output_file = &args[3];

    if !is_valid_directory(directory) {
        eprintln!("Error: {} is not a valid directory", directory);
        return;
    }

    let files = find_matching_files(directory, pattern);

    match write_to_file(output_file, &files) {
        Ok(_) => println!("Successfully wrote file names to {}", output_file),
        Err(e) => eprintln!("Failed to write to file {}: {}", output_file, e),
    }
}
```

### 6. Publish the Crate (Optional)

If you want to publish this crate on [crates.io](https://crates.io/), follow these steps:

1. **Create an account on crates.io** and link it to your Cargo installation by running:

    ```bash
    cargo login <API_KEY>
    ```

2. **Publish your crate** by running:
    ```bash
    cargo publish
    ```

This will make your `find_files` crate publicly available for anyone to use!