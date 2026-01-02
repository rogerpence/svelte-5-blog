---
title: JavaScript's spread operator
description: JavaScript's spread operator
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - javascript
---
In the code snippet, `...rest` is using object destructuring with the rest parameter syntax. Here's what's happening:

```typescript
const { ...rest } = formData;
```

This line is actually creating a shallow copy of the entire `formData` object. In this specific case, since there's no property being explicitly destructured before the `...rest`, it's equivalent to:

```typescript
const rest = { ...formData };
```

The `...` syntax has different uses:

1. When used in destructuring (like in your code): it collects all remaining properties into a new object
2. When used in spreading: it expands an object's properties into another object

Here's a more typical example to illustrate the difference:

```typescript
const formData = {
    name: "John",
    email: "john@example.com",
    age: 30,
};

// Destructuring with rest
const { name, ...remainingFields } = formData;
console.log(name); // 'John'
console.log(remainingFields); // { email: 'john@example.com', age: 30 }
```

In your code, since no properties are being extracted before the `...rest`, you're essentially just creating a copy of `formData`. This might be redundant unless there's a specific reason for creating this copy.

A more idiomatic way to write this could be to simply use `formData` directly if you don't need a separate copy:

```typescript
try {
    const result = formSchema.parse(formData);
    console.log("SUCCESS");
    console.log("result", result);
} catch (err: any) {
    const { fieldErrors: errors } = err.flatten();

    return {
        data: formData, // Just use formData directly
        errors,
        formData,
    };
}
```