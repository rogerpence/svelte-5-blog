---
title: JavaScript spread syntax; spread operator
description: JavaScript spread syntax; spread operator
date_created: '2025-07-17T00:00:00.000Z'
date_updated: '2025-11-07T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
Of course! The three dots (`...`) in that JavaScript code are using the **Object Spread Syntax**.

In simple terms, it's a shortcut for **copying all the properties from an existing object into a new one.**

Let's break down your specific example piece by piece.

```javascript
config = {
    // 1. First spread ...config
    ...config,

    // 2. A new or updated property
    [instanceId]: {
        componentType,

        // 3. Second spread ...props
        ...props
    }
};
```

### 1. `...config` (The Outer Spread)

This takes the existing `config` object and "spreads out" all of its key-value pairs into the new object we are creating. It's essentially making a copy of the original `config`.

*   **Why do this?** This pattern is a cornerstone of **immutability**. Instead of changing (mutating) the original `config` object directly, you create a brand new object that contains all the old data plus your new changes. This is crucial in frameworks like React for predictable state updates.

### 2. `[instanceId]: { ... }` (The New/Updated Property)

This part adds a new property to the object or updates an existing one.

*   `[instanceId]` is a **computed property name**. It means the key for this property is not literally "instanceId", but the *value* stored in the `instanceId` variable. For example, if `instanceId` is `'my-modal-1'`, the key will be `'my-modal-1'`.
*   Because this line comes *after* `...config`, if a key with the same value as `instanceId` already existed in the original `config`, **it will be overwritten** by this new definition. This is how you update a specific entry.

### 3. `...props` (The Inner Spread)

This does the exact same thing as the first spread, but for the inner object. It takes all the key-value pairs from an object called `props` and copies them into the new object being created for the `[instanceId]` key.


### A Concrete Example

Let's see it in action. Imagine this is your starting state:

```javascript
// The original object
let config = {
    'header-main': { componentType: 'Header', title: 'My App' },
    'footer-123': { componentType: 'Footer', text: '© 2023' }
};

// The new data you want to add/update
const instanceId = 'modal-confirm';
const componentType = 'Modal';
const props = {
    title: 'Are you sure?',
    confirmText: 'Yes, proceed'
};
```

Now, let's run your code:

```javascript
config = {
    ...config, // 1. Copy existing properties
    [instanceId]: { // 2. Add a new key: 'modal-confirm'
        componentType, // 3. Add componentType: 'Modal'
        ...props // 4. Copy properties from props
    }
};
```

Here is the step-by-step creation of the **new `config` object**:

1.  **Start with `...config`**: The new object becomes:
    ```json
    {
      "header-main": { "componentType": "Header", "title": "My App" },
      "footer-123": { "componentType": "Footer", "text": "© 2023" }
    }
    ```
2.  **Add `[instanceId]`**: The new key is `'modal-confirm'`. Its value is a new object.
3.  **Build the inner object**:
    *   It starts with `componentType`, which is `'Modal'`.
    *   Then, `...props` copies `title: 'Are you sure?'` and `confirmText: 'Yes, proceed'`.
    *   The final inner object is `{ componentType: 'Modal', title: 'Are you sure?', confirmText: 'Yes, proceed' }`.

The **final result** assigned to `config` is:

```javascript
// The new `config` object
{
    // Copied from the original
    'header-main': { componentType: 'Header', title: 'My App' },
    'footer-123': { componentType: 'Footer', text: '© 2023' },

    // The new entry
    'modal-confirm': {
        componentType: 'Modal',
        title: 'Are you sure?',
        confirmText: 'Yes, proceed'
    }
}
```

### Summary

The three dots (`...`) are the **Object Spread Syntax**, used here to:

1.  **Create an immutable copy** of the `config` object.
2.  **Add or update** a specific property within that copy.
3.  **Merge** properties from another object (`props`) into a nested object.

It's a modern, concise, and highly readable way to manipulate objects in JavaScript.