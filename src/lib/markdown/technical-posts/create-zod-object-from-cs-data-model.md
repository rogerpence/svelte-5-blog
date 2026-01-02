---
title: Create a Zod object from a C# data model
description: Create a Zod object from a C# data model
date_created: '2025-05-31T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - zod
  - data-model
---
Given this C# data model:

```
using System;

namespace DataModels;

public partial class Categoryrules
{
    /*
     | Model type: table
     */
    public int id { get; set; } 
    public string? description { get; set; } 
    public string? rule { get; set; } 
    public string? value { get; set; } 
    public string? category { get; set; }
}
```

Here is a corresponding Zod object:

```typescript
import { z } from 'zod';

export const categoryRulesSchema = z.object({
  // public int id { get; set; }
  // C# 'int' is a non-nullable integer.
  id: z.number().int(),

  // public string? description { get; set; }
  // C# 'string?' means the string can be null.
  // In Zod, .nullable() means the value can be the type or null.
  // If the key itself might be missing (undefined), you'd use .optional() or .nullish().
  // Assuming if the property exists, it's either a string or null:
  description: z.string().nullable(),

  // public string? rule { get; set; }
  rule: z.string().nullable(),

  // public string? value { get; set; }
  value: z.string().nullable(),

  // public string? category { get; set; }
  category: z.string().nullable(),
});

// If you want to infer a TypeScript type from this schema:
export type CategoryRules = z.infer<typeof categoryRulesSchema>;

/*
// Example Usage:

const validData: CategoryRules = {
  id: 1,
  description: "Rule for electronics",
  rule: "IF price > 1000",
  value: "HighValue",
  category: "Electronics",
};

const validDataWithNulls: CategoryRules = {
  id: 2,
  description: null,
  rule: "ALWAYS",
  value: "Default",
  category: null,
};

const invalidData = {
  id: "not-a-number", // Fails id: z.number()
  description: 123,      // Fails description: z.string()
  // rule is missing, but since it's nullable, not optional, this would fail
  // if you strictly parse. If keys can be missing, use .optional()
  value: "Some Value",
  category: "Books",
};

try {
  categoryRulesSchema.parse(validData);
  console.log("validData is valid!");

  categoryRulesSchema.parse(validDataWithNulls);
  console.log("validDataWithNulls is valid!");

  // This will throw a ZodError
  // categoryRulesSchema.parse(invalidData);
  // console.log("invalidData is valid (this won't be reached)");
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error("Validation failed:", e.errors);
  } else {
    console.error("An unexpected error:", e);
  }
}

// --- Consideration: Optional vs. Nullable ---
// If the C# properties, when serialized to JSON, might be *omitted* entirely
// (not just present with a null value), you might prefer .optional()
// or .nullish() for the string fields.

// Example with .optional() (keys can be missing, implying undefined)
const categoryRulesOptionalSchema = z.object({
  id: z.number().int(),
  description: z.string().optional(), // string | undefined
  rule: z.string().optional(),
  value: z.string().optional(),
  category: z.string().optional(),
});

// Example with .nullish() (keys can be missing OR value can be null)
const categoryRulesNullishSchema = z.object({
  id: z.number().int(),
  description: z.string().nullish(), // string | null | undefined
  rule: z.string().nullish(),
  value: z.string().nullish(),
  category: z.string().nullish(),
});

// The choice between .nullable(), .optional(), and .nullish() depends on
// how your C# objects are serialized and what you expect on the consuming (JavaScript/TypeScript) side.
// For a direct translation of C# `string?` where the property is always present in the object
// (even if its value is null), `.nullable()` is the most accurate.
*/
```

**Explanation of Choices:**

1.  **`id: z.number().int()`**:
    *   C# `int` is a non-nullable 32-bit signed integer.
    *   `z.number()` specifies it must be a number.
    *   `.int()` adds a refinement that the number must be an integer.
    *   It's not `nullable` because the C# `int` is not `int?`.

2.  **`description: z.string().nullable()`** (and similar for `rule`, `value`, `category`):
    *   C# `string?` indicates that the `description` property can hold a string value or `null`.
    *   `z.string()` specifies it must be a string if it's not null.
    *   `.nullable()` allows the value to be `null` in addition to being a string.

**Important Consideration: `nullable()` vs. `optional()` vs. `nullish()`**

*   **`.nullable()`**: The key must exist, but its value can be the specified type OR `null`.
    *   `{ description: null }` is valid.
    *   `{ description: "text" }` is valid.
    *   `{}` (missing `description` key) is **invalid**.
    *   This most closely matches C# `string?` if you assume that when the C# object is serialized (e.g., to JSON), `null` properties are explicitly included as `key: null`.

*   **`.optional()`**: The key can be missing entirely (which means its value is `undefined` in JavaScript), OR if it exists, it must be the specified type. It does NOT allow `null` unless you chain it (e.g., `.nullable().optional()`).
    *   `{ description: "text" }` is valid.
    *   `{}` (missing `description` key) is valid (value becomes `undefined`).
    *   `{ description: null }` is **invalid** (unless you did `z.string().nullable().optional()`).

*   **`.nullish()`**: The key can be missing (`undefined`), OR its value can be `null`, OR it can be the specified type. It's shorthand for `.optional().nullable()` in terms of what it allows.
    *   `{ description: "text" }` is valid.
    *   `{ description: null }` is valid.
    *   `{}` (missing `description` key) is valid.

**For your C# model, `z.string().nullable()` is generally the most direct translation, assuming that if a C# string property is `null`, it will be serialized as `key: null` rather than the key being omitted entirely from the JSON/object.** If your serialization process omits keys for `null` values, then `z.string().nullish()` or `z.string().optional()` (if `null` isn't a possible value when the key is present) would be more appropriate.