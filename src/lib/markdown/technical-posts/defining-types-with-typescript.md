---
title: Defining types with TypeScript
description: Defining types with TypeScript
date_created: '2025-07-03T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
## Required 

The `Required<T>` utility type in TypeScript removes the `optional` and `nullable` modifiers from all properties of a type, making them all required and non-nullable.

However, in your specific case:

```typescript
export type CategoryRulesResponse = Required<CategoryRulesEntity>;
```

**This won't work as expected** because your `CategoryRulesEntity` properties are defined as `nullable` (e.g., `string | null`), not `optional` (e.g., `string | undefined`).

## What `Required` does:

- **Removes `?` (optional)**: `{ name?: string }` → `{ name: string }`
- **Does NOT remove `| null`**: `{ name: string | null }` → `{ name: string | null }`

## Your current types:

```typescript
// Your CategoryRulesEntity looks like this:
type CategoryRulesEntity = {
  id: number | null;
  description: string | null;
  rule: string | null;
  value: string | null;
  category: string | null;
}

// Required<CategoryRulesEntity> would still be:
type CategoryRulesResponse = {
  id: number | null;        // Still nullable!
  description: string | null; // Still nullable!
  rule: string | null;       // Still nullable!
  value: string | null;      // Still nullable!
  category: string | null;   // Still nullable!
}
```

## What you probably want:

```typescript
// To remove nullability, you need a custom utility type:
type NonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type CategoryRulesResponse = NonNullable<CategoryRulesEntity>;
// Result:
// {
//   id: number;
//   description: string;
//   rule: string;
//   value: string;
//   category: string;
// }
```

## Better approach for your use case:

```typescript
import { z } from 'zod';

export const categoryRulesSchema = z.object({
  id: z.number().int().nullable(),
  description: z.string().nullable(),
  rule: z.string().nullable(),
  value: z.string().nullable(),
  category: z.string().nullable()
});

// Database entity (matches physical table with nullable fields)
export type CategoryRulesEntity = z.infer<typeof categoryRulesSchema>;

// DTO without id and with required fields
export type CategoryRulesDto = {
  description: string;
  rule: string;
  value: string;
  category: string;
};

// Response type with all fields required (for API responses)
export type CategoryRulesResponse = {
  id: number;
  description: string;
  rule: string;
  value: string;
  category: string;
};
```

This approach is clearer and more explicit about what each type represents.