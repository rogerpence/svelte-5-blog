---
title: Human friendly sorting in TypeScript
description: Human friendly sorting in Typescript
date_updated: 2025-12-18
date_created: 2025-02-02T00:00:00.000Z
date_published:
pinned: false
tags:
  - typescript
---
Also, called "natural sort order," this code performs  a **smart string comparison** using JavaScript's `localeCompare` method. Here's the breakdown:
## **What it does:**

````typescript
// String comparison (case-insensitive)
comparison = String(aVal).localeCompare(String(bVal), undefined, {
    sensitivity: 'base',
    numeric: true
});
````

## **Parameters explained:**

**1. `String(aVal)` and `String(bVal)`**
- Converts the values to strings before comparing
- Handles cases where values might not already be strings

**2. `undefined` (locale parameter)**
- Uses the browser/system's default locale
- You could specify like `'en-US'` for specific locale rules

**3. `sensitivity: 'base'`**
- Makes comparison **case-insensitive** and **accent-insensitive**
- Examples:
  - `'Apple'` equals `'apple'` ✅
  - `'café'` equals `'cafe'` ✅
  - `'a'` comes before `'b'` ✅

**4. numeric: true** (the important one!)
- Treats numeric substrings as numbers, not strings
- **Without `numeric: true:**
  - `"10" < "2" (alphabetical: "1" comes before "2")`
- **With numeric: true:**
  - `"2" < "10" (numeric: 2 is less than 10) ✅`

## **Examples:**

```typescript
// Without numeric: true (alphabetical)
['item10', 'item2', 'item1'].sort() 
// Result: ['item1', 'item10', 'item2'] ❌ Wrong!

// With numeric: true (natural sort)
['item10', 'item2', 'item1'].sort((a, b) => 
  a.localeCompare(b, undefined, { numeric: true })
)
// Result: ['item1', 'item2', 'item10'] ✅ Correct!

// Case insensitive with sensitivity: 'base'
'Apple'.localeCompare('apple', undefined, { sensitivity: 'base' })
// Result: 0 (equal)
```

## **Why this is useful in your sort function:**

- Handles **tag names** that might have numbers: `"version1"`, `"version10"`, `"version2"`
- **Case-insensitive**: `"JavaScript"` and `"javascript"` sort together
- **Natural sorting**: Matches how humans expect things to be ordered

This is called **"natural sort order"** or **"human-friendly sorting"**! 🎯

This code applies the **sort order direction** (ascending or descending) to the comparison result.

## **How it works:**

```typescript
const multiplier = order === 'desc' ? -1 : 1;

if (comparison !== 0) {
    return comparison * multiplier;
}
```
## **Breaking it down:**

**1. The `comparison` value:**
- `-1` means `a < b` (a comes before b)
- `0` means `a === b` (equal)
- `1` means `a > b` (a comes after b)

**2. The `multiplier`:**
- `1` for ascending (`'asc'`) - keeps the comparison as-is
- `-1` for descending (`'desc'`) - **flips** the comparison

**3. Multiplying:**
- `comparison * 1` = no change (ascending order)
- `comparison * -1` = **reverses** the order (descending)

## **Examples:**

**Ascending (multiplier = 1):**
```typescript
// Comparing numbers: 5 vs 10
comparison = 5 - 10 = -5 (negative, so 5 comes first)
return -5 * 1 = -5  // ✅ 5 before 10 (ascending)
```

**Descending (multiplier = -1):**
```typescript
// Comparing numbers: 5 vs 10
comparison = 5 - 10 = -5 (negative, so normally 5 comes first)
return -5 * -1 = 5   // ✅ 10 before 5 (descending, reversed!)
```

## **Why check `!== 0` first?**

If `comparison === 0`, the values are **equal** for this property, so we need to check the **next property** in the `props` array. Only when we find a difference (`!== 0`) do we return and stop comparing.

**Example with multiple properties:**
```typescript
sortObjArray(tags, ['count', 'tag'], ['desc', 'asc']);

// If two items have the same count (comparison = 0):
// - Don't return yet
// - Continue to next iteration and compare 'tag'
// - If tags are different, return that comparison
```

This is how **multi-level sorting** works - it only uses the next property as a "tie-breaker"! 🎯