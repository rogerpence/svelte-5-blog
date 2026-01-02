---
title: directory watcher in go
description: directory watcher in go
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-09-30T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - go
---
created using
Okay, here's a Go program that utilizes `fsnotify` to monitor a directory for file changes and calls a handler function when changes occur:

```go
package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/fsnotify/fsnotify"
)

// handleFileChange is the function that gets called when a file change is detected.
func handleFileChange(filePath string) {
	fmt.Println("File changed:", filePath)
	// Add your custom processing logic here
	// For example:

    file, err := os.ReadFile(filePath)
    if err != nil {
        fmt.Println("Error reading file:", err)
        return
    }

    fmt.Println("Contents of the file:\n", string(file))


}

func watchDirectory(dirPath string) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return fmt.Errorf("error creating watcher: %w", err)
	}
	defer watcher.Close()

	err = watcher.Add(dirPath)
	if err != nil {
		return fmt.Errorf("error adding directory to watcher: %w", err)
	}

	fmt.Println("Watching directory:", dirPath)

    done := make(chan bool)
	go func() {
        defer close(done)
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}

				if event.Op&fsnotify.Write == fsnotify.Write ||
                    event.Op&fsnotify.Create == fsnotify.Create ||
                    event.Op&fsnotify.Remove == fsnotify.Remove ||
                    event.Op&fsnotify.Rename == fsnotify.Rename  {
					handleFileChange(event.Name)
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()
    <-done
	return nil
}

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage: go run main.go <directory_to_watch>")
		return
	}

	dirPath := os.Args[1]
	absDirPath, err := filepath.Abs(dirPath)
    if err != nil {
        log.Fatalf("Error getting absolute path: %v", err)
    }

    _, err = os.Stat(absDirPath)
    if os.IsNotExist(err) {
        log.Fatalf("Directory '%s' does not exist", absDirPath)
    }

    // Create a dummy file if the watched directory is empty, for demonstration purposes
    files, err := os.ReadDir(absDirPath)
    if err != nil {
        log.Fatalf("Error reading watched directory: %v", err)
    }

    if len(files) == 0 {
        dummyFilePath := filepath.Join(absDirPath, "dummy.txt")
        err := os.WriteFile(dummyFilePath, []byte("Initial Content"), 0644)
        if err != nil {
             log.Fatalf("Error creating dummy file in watched directory: %v", err)
        }
    }


	err = watchDirectory(absDirPath)
	if err != nil {
		log.Fatal("Error watching directory:", err)
	}
}
```

**Explanation:**

1. **Imports:**

    - `fmt`: For printing output.
    - `log`: For error logging.
    - `os`: For interacting with the operating system (command-line arguments, creating files, etc.)
    - `path/filepath`: For handling file paths
    - `time`: For time related functions
    - `github.com/fsnotify/fsnotify`: The core library for file system notifications.

2. **`handleFileChange(filePath string)` Function:**

    - This is the function you'll customize to process changed files.
    - It currently prints the file path to the console and reads the file content.
    - **Modify this function to perform your desired actions** (e.g., send data to a server, trigger builds, update configuration).

3. **`watchDirectory(dirPath string)` Function:**

    - `fsnotify.NewWatcher()`: Creates a new watcher instance.
    - `defer watcher.Close()`: Ensures the watcher is closed when the function exits.
    - `watcher.Add(dirPath)`: Adds the directory to be watched.
    - **The `for` loop and `select` statement are the core of the watcher logic:**
        - `<-watcher.Events`: Receives file change events from the watcher's event channel.
        - `event.Op & fsnotify.Write == fsnotify.Write`: Checks if the event was a write operation. Add/Remove/Rename events are also checked
        - `handleFileChange(event.Name)`: Calls your custom handler function if a change is detected.
        - `<-watcher.Errors`: Receives any errors from the watcher's error channel.

4. **`main()` Function:**
    - **Argument Parsing:** Checks if the user provided the directory path as a command-line argument.
    - **Getting absolute path**: Ensure that the provided path is absolute
    - **Check if directory exists**: Exit program if the provided directory does not exist
    - **Create dummy file**: Create a dummy file in the watched directory to demostrate the program if the directory is empty
    - **Error handling**: Log fatal errors using `log.Fatalf`
    - `watchDirectory(absDirPath)`: Starts the directory watching process.

**How to Run:**

1. **Save:** Save the code as `main.go`.
2. **Install `fsnotify`:**
    ```bash
    go get github.com/fsnotify/fsnotify
    ```
3. **Run from the terminal:**
    ```bash
    go run main.go /path/to/your/directory
    ```
    (Replace `/path/to/your/directory` with the actual path you want to monitor)

**Key Points:**

-   **Event Types:** The `fsnotify.Op` enum represents different types of events: `Write`, `Create`, `Remove`, `Rename`, and more. You can choose which events to react to in the `select` statement.
-   **Error Handling:** Check errors for robustness. The program includes some error handling but you may want to implement more elaborate error checking and recovery.
-   **Cross-Platform:** `fsnotify` is designed to work on multiple operating systems.
-   **Performance:** File system events are generally efficient. If you're dealing with a directory with _massive_ numbers of files, there are strategies you could implement to reduce memory usage.
-   **Customization:** The `handleFileChange` function is where you implement your specific requirements.
-   **No Blocking**: The `watchDirectory` function launches a goroutine for watching the file system events. This means that you can continue to interact with your terminal after running the program.

Let me know if you have any more questions or want to explore more advanced aspects!