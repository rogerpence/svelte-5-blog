---
title: typescript-types-interfaaces-tutorial
description: typescript-types-interfaaces-tutorial
date_created: '2025-06-06T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
Of course! Here is a small, beginner-friendly tutorial on using `type` and `interface` in TypeScript.


### **A Beginner's Guide to TypeScript: `type` vs. `interface`**

In TypeScript, we use `type` and `interface` to define the "shape" of our data. They help us catch bugs early, enable powerful autocompletion in our code editor, and make our code easier to understand.

Let's explore how to use them.

#### **1. What's the Goal? Describing an Object**

Imagine we're building an app that deals with users. A user object might look like this in JavaScript:

```javascript
const user = {
  id: 1,
  username: "Dave",
  isPremium: true
};
```

TypeScript lets us create a blueprint for this object's structure. This is where `type` and `interface` come in.


#### **2. Using `interface`**

An `interface` is a powerful way to define a "contract" for an object's shape. It's best suited for describing objects or classes.

**How to create it:**

```typescript
interface User {
  id: number;
  username: string;
  isPremium: boolean;
  // We can also add optional properties with '?'
  email?: string; 
}
```

**How to use it:**

Now, we can "type" our variable. This tells TypeScript that our `user` variable *must* conform to the `User` interface.

```typescript
const myUser: User = {
  id: 1,
  username: "Dave",
  isPremium: true
  // email is optional, so we can leave it out
};

// TypeScript will now protect us!
// myUser.id = "2"; // ❌ Error! Type 'string' is not assignable to type 'number'.
// myUser.name = "John"; // ❌ Error! Property 'name' does not exist on type 'User'.
```


#### **3. Using `type`**

A `type` alias is a bit more versatile. While it can do everything an `interface` can for objects, it can also describe other things like primitives, unions, and tuples.

**How to create it (for an object):**

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};
```

**How to use it:**

It works just like an interface for typing objects.

```typescript
const myProduct: Product = {
  id: 101,
  name: "Fancy Mug",
  price: 12.99
};
```

**The Superpower of `type`: Unions**

`type` can also define a variable that can be one of several types. This is called a **union type**. `interface` cannot do this.

```typescript
type Status = "pending" | "approved" | "rejected";

let orderStatus: Status = "pending";
orderStatus = "approved";

// orderStatus = "delivered"; // ❌ Error! Type '"delivered"' is not assignable to type 'Status'.
```


#### **4. The Big Question: `type` or `interface`?**

This is the most common question for newcomers. Here's a simple breakdown.

| Feature                 | `interface`                                       | `type`                                                      |
| ----------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| **Best For**            | Describing object shapes and class contracts.     | Describing unions, primitives, tuples, or any complex type. |
| **Extending**           | Yes, using `extends`.                             | Yes, using intersections (`&`).                             |
| **Declaration Merging** | Yes.                                              | No.                                                         |

**Let's look at the two key differences:**

**A) Extending / Combining**

Both can be combined, but the syntax is different.

**With `interface`:** We use `extends`.

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = { name: "Rex", breed: "German Shepherd" };
```

**With `type`:** We use the intersection operator `&`.

```typescript
type Person = {
  name: string;
};

type Employee = Person & {
  employeeId: number;
};

const myEmployee: Employee = { name: "Alice", employeeId: 123 };
```

**B) Declaration Merging (The Biggest Difference)**

An `interface` can be defined multiple times in the same scope, and TypeScript will merge them into one. This is useful when working with third-party libraries that you need to augment.

```typescript
// First declaration
interface Window {
  title: string;
}

// Somewhere else, we "re-open" it
interface Window {
  isFullScreen: boolean;
}

// TypeScript combines them! The final interface is:
// interface Window {
//   title: string;
//   isFullScreen: boolean;
// }
```

A `type` cannot be changed after it's created. This will throw an error.

```typescript
type MyType = { a: string };
// type MyType = { b: string }; // ❌ Error! Duplicate identifier 'MyType'.
```


#### **Summary & Recommendation**

*   **Use `interface` when:**
    *   You are defining the shape of an **object** or a **class**.
    *   You anticipate that you or others might need to extend it in the future (declaration merging). This makes `interface` ideal for library or API contracts.

*   **Use `type` when:**
    *   You need to define a **union** (`string | number`).
    *   You want to create a simple alias for a primitive (`type UserID = string`).
    *   You need to define a tuple (`type Point = [number, number]`).

**If you're unsure, here's a good rule of thumb:** Start with `interface` for your objects. If you find you need features that only `type` provides (like unions), switch to `type`. Many teams simply pick one for consistency when defining objects. Both are great tools