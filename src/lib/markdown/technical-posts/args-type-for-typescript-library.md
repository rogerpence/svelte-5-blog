---
title: ParsedArgs type for TypeScript cmd-args-lib
description: ParsedArgs type for TypeScript cmd-args-lib
date_updated: '2025-12-11T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
This type creates an object where each property corresponds to a command line argument, with the correct value type. Let me break it down:

## **Line by line:**

```typescript
type ParsedArgs<T extends readonly ArgDefinition<ArgType>[]> = {
    [K in T[number]['name']]: Extract<T[number], { name: K }>['value'];
};
```

### **1. `T extends readonly ArgDefinition<ArgType>[]`**
- `T` is a **readonly array** of argument definitions
- Example: Your `cmdLineArgs` array

### **2. `T[number]['name']`**
- Gets all the `name` properties from all items in the array
- For your example: `'outputFile' | 'inputFile' | 'lines'`

### **3. `[K in T[number]['name']]`**
- **Mapped type** - creates a property for each name
- Iterates over: `'outputFile'`, `'inputFile'`, `'lines'`

### **4. `Extract<T[number], { name: K }>`**
- Finds the specific `ArgDefinition` where `name` matches `K`
- Example: When `K` is `'outputFile'`, it extracts:
  ```typescript
  { name: 'outputFile', type: 'string', default: 'output.text', required: true, value: null }
  ```

### **5. `['value']`**
- Gets the type of the `value` property from that definition
- For `'outputFile'`: `string | null`
- For `'lines'`: `number | null`

## **Real example:**

Given your `cmdLineArgs`:

```typescript
const cmdLineArgs = [
    { name: 'outputFile', type: 'string', default: 'output.text', required: true, value: null },
    { name: 'inputFile', type: 'string', required: true, value: null },
    { name: 'lines', type: 'number', default: 275, required: false, value: null }
] as const;
```

**`ParsedArgs` becomes:**

```typescript
{
    outputFile: string | null;
    inputFile: string | null;
    lines: number | null;
}
```

## **Why this is powerful:**

```typescript
const args = parseCommandLineArgs(cmdLineArgs);

args.outputFile  // ✅ TypeScript knows: string | null
args.lines       // ✅ TypeScript knows: number | null
args.unknown     // ❌ Error: Property 'unknown' does not exist

if (typeof args.lines === 'number') {
    const doubled = args.lines * 2;  // ✅ Type narrowed to number
}
```

It automatically creates the correct return type with **autocomplete and type checking** based on your argument definitions! 🎯

## Where does the 'number' variable come from

The `number` in `T[number]` is TypeScript's syntax for **"any element of the array"** - it's not the `number` type!

## **What `T[number]` means:**

When you have an array type, `[number]` accesses **any element** of that array:

```typescript
// Given this array type:
type MyArray = [
  { name: 'outputFile', type: 'string', value: string | null },
  { name: 'lines', type: 'number', value: number | null }
];

// T[number] means "get all possible elements"
type AllElements = MyArray[number];
// Result: 
// { name: 'outputFile', type: 'string', value: string | null } | 
// { name: 'lines', type: 'number', value: number | null }
```

## **In your case:**

```typescript
type ParsedArgs<T extends readonly ArgDefinition<ArgType>[]> = {
    [K in T[number]['name']]: Extract<T[number], { name: K }>['value'];
    //    ^^^^^^^^^                   ^^^^^^^^^
    //    All elements                All elements
};
```

**Step by step:**

1. `T[number]` = All argument definitions in the array (union)
2. `T[number]['name']` = All the name properties: `'outputFile' | 'inputFile' | 'lines'`
3. `Extract<T[number], { name: K }>` = Find the specific definition where name matches K
4. `['value']` = Get the value type from that definition

## **Think of it like:**

```typescript
// Array indexing in JavaScript:
const myArray = ['a', 'b', 'c'];
myArray[0]  // 'a'
myArray[1]  // 'b'
myArray[2]  // 'c'

// TypeScript type indexing:
type MyArray = ['a', 'b', 'c'];
MyArray[0]     // type: 'a'
MyArray[1]     // type: 'b'
MyArray[number] // type: 'a' | 'b' | 'c' (union of all elements)
```

So `[number]` is just TypeScript's way of saying **"give me the type of any element in this array"**! 🎯