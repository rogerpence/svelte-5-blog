---
title: Using regex in Rust
description: Using regex in Rust
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - rust
---
To match the lines read from a file with a regular expression in Rust, you can use the `regex` crate. Here’s a step-by-step guide to integrating regex matching into your loop:

1. **Add the `regex` crate to your `Cargo.toml`**:

    ```toml
    [dependencies]
    regex = "1"
    ```

2. **Import the necessary modules**:

    ```rust
    use regex::Regex;
    use std::fs::File;
    use std::io::{self, BufRead};
    ```

3. **Create a `Regex` instance and use it within the loop**:
   Here’s an updated version of your loop that uses a regex to match lines:

    ```rust
    use regex::Regex;
    use std::fs::File;
    use std::io::{self, BufRead};

    fn read_lines_from_file(filename: &str) -> io::Result<Vec<String>> {
        let file = File::open(filename)?;
        let reader = io::BufReader::new(file);
        let mut lines = Vec::new();

        // Create a Regex instance
        let re = Regex::new(r"your_regex_pattern_here").expect("Invalid regex pattern");

        for line in reader.lines() {
            match line {
                Ok(content) => {
                    // Check if the line matches the regex
                    if re.is_match(&content) {
                        lines.push(content);
                    }
                }
                Err(e) => eprintln!("Error reading line: {}", e),
            }
        }

        Ok(lines)
    }

    fn main() {
        match read_lines_from_file("example.txt") {
            Ok(lines) => {
                for line in lines {
                    println!("{}", line);
                }
            }
            Err(e) => eprintln!("Error reading file: {}", e),
        }
    }
    ```

### Explanation:

-   **Create a Regex Instance**: Use `Regex::new` to compile your regular expression. Replace `r"your_regex_pattern_here"` with your actual regex pattern.
-   **Match Lines**: Within the loop, use `re.is_match(&content)` to check if the line matches the regex. If it matches, you push it to the `lines` vector.

### Example Regex Patterns:

-   **Simple Pattern**: `r"\d+"` (matches any line containing one or more digits).
-   **Complex Pattern**: `r"^\w+\s+\d{4}$"` (matches lines starting with one or more word characters, followed by whitespace, and ending with exactly four digits).

Feel free to replace the regex pattern with one that suits your needs, and let me know if you need any more help!