---
title: Javascript map function
description: Javascript map function
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
Okay, let's dive deeper into the JavaScript `Map` object. It's a powerful data structure for storing key-value pairs, offering advantages over plain JavaScript objects in certain scenarios.

**Key Characteristics of `Map`**

1.  **Key Flexibility:**

    -   Unlike regular JavaScript objects, which can only use strings or Symbols as keys, a `Map` can use _any_ data type as a key. This includes:
        -   Strings
        -   Numbers
        -   Booleans
        -   `null`
        -   `undefined`
        -   Symbols
        -   Objects (including other Maps)
        -   Functions
    -   This makes `Map` suitable for situations where you need to associate data with complex or non-string identifiers.

2.  **Order Preservation:**

    -   `Map` maintains the order in which key-value pairs are inserted. When you iterate over a `Map`, you get the entries in the order they were added. This behavior contrasts with plain JavaScript objects, where the order of properties is not guaranteed.

3.  **Size:**

    -   `Map` has a built-in `.size` property that efficiently provides the number of key-value pairs it holds. This is different from a regular object, where you have to use `Object.keys(obj).length` to get the number of properties, which can be less performant.

4.  **Built-in Methods:**
    -   `Map` provides several methods for adding, retrieving, updating, and removing entries:
        -   `set(key, value)`: Adds a new key-value pair or updates the value of an existing key.
        -   `get(key)`: Retrieves the value associated with the given key. Returns `undefined` if the key doesn't exist.
        -   `has(key)`: Checks if the given key exists in the map and returns a boolean
        -   `delete(key)`: Removes the key-value pair associated with the given key. Returns `true` if the key existed and was removed, `false` otherwise.
        -   `clear()`: Removes all key-value pairs from the map.
        -   `keys()`: Returns an iterator for the keys in the map.
        -   `values()`: Returns an iterator for the values in the map.
        -   `entries()`: Returns an iterator for the key-value pairs (as `[key, value]` arrays) in the map.
        -   `forEach(callbackFn)`: Executes a provided function once for each key-value pair in the map in insertion order.

**How to use a Map**

1.  **Creating a `Map`:**

    ```javascript
    const myMap = new Map(); // Create an empty map
    const anotherMap = new Map([
        // Create a map with initial key-value pairs
        ["key1", "value1"],
        [123, "number key"],
        [{ id: 1 }, "object key"],
    ]);
    ```

2.  **Adding and Updating:**

    ```javascript
    myMap.set("name", "Alice");
    myMap.set("age", 30);
    myMap.set("age", 31); // Updates the age
    ```

3.  **Retrieving:**

    ```javascript
    console.log(myMap.get("name")); // Output: Alice
    console.log(myMap.get("age")); // Output: 31
    console.log(myMap.get("city")); // Output: undefined
    ```

4.  **Checking Existence:**

    ```javascript
    console.log(myMap.has("name")); // Output: true
    console.log(myMap.has("city")); // Output: false
    ```

5.  **Removing and Clearing:**

    ```javascript
    myMap.delete("age"); // Remove age
    console.log(myMap.has("age")); // Output: false
    myMap.clear(); // Remove all entries
    console.log(myMap.size); // Output: 0
    ```

6.  **Iterating:**

    ```javascript
    const iterateMap = new Map([
        ["one", 1],
        ["two", 2],
        ["three", 3],
    ]);

    for (const key of iterateMap.keys()) {
        console.log(key);
    }
    // Output: one, two, three

    for (const value of iterateMap.values()) {
        console.log(value);
    }
    // Output: 1, 2, 3

    for (const [key, value] of iterateMap.entries()) {
        console.log(`${key}: ${value}`);
    }
    // Output: one: 1, two: 2, three: 3

    iterateMap.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
    // Output: one: 1, two: 2, three: 3
    ```

**Why Use `Map` Over Plain Objects?**

-   **Complex Keys:** When you need keys that are not strings or Symbols (e.g., objects or numbers).
-   **Order Matters:** When you need to preserve the order in which key-value pairs are added.
-   **Size Property:** For efficiently getting the number of entries.
-   **Avoiding Prototype Pollution:** Using a plain object for mapping can sometimes lead to unexpected conflicts with properties inherited from the object's prototype. Maps avoid this issue.
-   **Built-in Methods:** Maps provide an API that provides all common usecases for this datatype

**When to Use Plain Objects:**

-   Simple key-value lookups with string keys.
-   JSON object structure
-   Creating an object literal.

**In summary:** The `Map` object is a versatile tool in JavaScript for managing key-value pairs, especially when you need keys of arbitrary types, order preservation, or the built-in methods it provides. It's an essential part of modern JavaScript development.