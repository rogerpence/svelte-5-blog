---
title: TypeScript nested typing
description: TypeScript nested typing
date_created: '2025-07-17T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
```js
export interface ComponentProps {
    orange: {
        size: 'small' | 'medium' | 'large';
        rate: number;
    };
    blue: {
        size: 'small' | 'medium' | 'large';
        length: 'short' | 'medium' | 'long';
    };
    green: {
        size: 'small' | 'medium' | 'large';
        intensity: 'bright' | 'normal' | 'dim';
    };
}

export type ComponentType = keyof ComponentProps;

export type ComponentConfig = {
    [K in ComponentType]: ComponentProps[K] & { componentType: K };
};
```

This is a sophisticated TypeScript pattern that creates a type-safe mapping system for your components. Let me break it down:

## 1. `ComponentProps` Interface
```typescript
export interface ComponentProps {
    orange: {
        size: 'small' | 'medium' | 'large';
        rate: number;
    };
    blue: {
        size: 'small' | 'medium' | 'large';
        length: 'short' | 'medium' | 'long';
    };
    green: {
        size: 'small' | 'medium' | 'large';
        intensity: 'bright' | 'normal' | 'dim';
    };
}
```

This creates a **lookup table** where:
- Keys are component names (`'orange'`, `'blue'`, `'green'`)
- Values are the prop interfaces for each component

So `ComponentProps['orange']` gives you `{ size: 'small' | 'medium' | 'large'; rate: number; }`

## 2. `ComponentType` Type
```typescript
export type ComponentType = keyof ComponentProps;
```

This extracts the **keys** from `ComponentProps`, so:
- `ComponentType` = `'orange' | 'blue' | 'green'`

## 3. `ComponentConfig` Type (The Complex One)
```typescript
export type ComponentConfig = {
    [K in ComponentType]: ComponentProps[K] & { componentType: K };
};
```

This is a **mapped type** that transforms the original interface. Let me break it down:

### `[K in ComponentType]` 
This iterates over each component type (`'orange'`, `'blue'`, `'green'`)

### `ComponentProps[K]`
This gets the props for component `K`. For example:
- When `K = 'orange'`, this is `{ size: 'small' | 'medium' | 'large'; rate: number; }`

### `& { componentType: K }`
This **adds** a `componentType` property with the literal type of `K`

### The Result
`ComponentConfig` becomes:
```typescript
{
    orange: {
        size: 'small' | 'medium' | 'large';
        rate: number;
        componentType: 'orange';  // Added this!
    };
    blue: {
        size: 'small' | 'medium' | 'large';
        length: 'short' | 'medium' | 'long';
        componentType: 'blue';  // Added this!
    };
    green: {
        size: 'small' | 'medium' | 'large';
        intensity: 'bright' | 'normal' | 'dim';
        componentType: 'green';  // Added this!
    };
}
```

## Why This Pattern is Powerful

1. **Type Safety**: You can't accidentally pass `rate` to a blue component
2. **IntelliSense**: IDE autocompletes the right props for each component
3. **Literal Types**: `componentType: 'orange'` is more specific than `componentType: string`
4. **Single Source of Truth**: Change props in one place, types update everywhere

## Usage Example
```typescript
// This is type-safe!
const orangeConfig: ComponentConfig['orange'] = {
    size: 'large',
    rate: 5,
    componentType: 'orange'  // Must be exactly 'orange'
};

// This would be a TypeScript error!
const invalidConfig: ComponentConfig['orange'] = {
    size: 'large',
    length: 'short',  // ❌ Error! Orange doesn't have 'length'
    componentType: 'blue'  // ❌ Error! Must be 'orange'
};
```

This pattern ensures your dynamic component system is completely type-safe while remaining flexible.