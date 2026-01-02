---
title: Typing arrow functions
description: Typing arrow functions
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
```
import type { Product, ProductGroup } from '$lib/global.d.ts'; // Adjust the path accordingly

const groupBy = (products: Product[], property_name: keyof Product): ProductGroup =>
    products.reduce((grouped: ProductGroup, element: Product) => {
        const key = element[property_name] as string; // Ensure the key is a string
        return {
            ...grouped,
            [key]: [...(grouped[key] || []), element]
        };
    }, {});
```

The syntax you're using is mostly correct, but there are a few improvements to make it more type-safe and better match your existing type definitions, particularly around the use of `any`. You want to replace `any` with proper type annotations, and ensure that the return value is properly typed as `ProductsGrouped`.

Here’s how you can rewrite it using proper types:

### Improved Version:

```typescript
import type { Product, ProductGroup } from "$lib/global.d.ts"; // Adjust the path accordingly

const groupBy = (
    products: Product[],
    property_name: keyof Product
): ProductGroup =>
    products.reduce((grouped: ProductGroup, element: Product) => {
        const key = element[property_name] as string; // Ensure the key is a string
        return {
            ...grouped,
            [key]: [...(grouped[key] || []), element],
        };
    }, {});
```

### Explanation:

1. **Type `Product[]` for `products`:** The `products` parameter is an array of `Product`, so we specify `products: Product[]`.
2. **Type `keyof Product` for `property_name`:** The `property_name` is a key of the `Product` type, so we use `property_name: keyof Product` to restrict it to the keys of the `Product` object.
3. **Type `ProductGroup` for `grouped`:** The `reduce` function starts with an empty object `{}` of type `ProductGroup`, ensuring that TypeScript knows it will be an object with string keys and arrays of `Product` values.
4. **Type the return value as `ProductGroup`:** The return value is typed as `ProductGroup` to match your expected result.

### Additional Considerations:

-   **Type Safety:** By using `keyof Product`, you restrict `property_name` to be one of the actual properties of `Product`. This avoids passing arbitrary strings as the property name.
-   **Casting Key:** Since `property_name` is of type `keyof Product`, we cast the resulting key to `string` because object keys in JavaScript are always strings.

This code ensures that your `groupBy` function is fully type-safe and returns a correctly typed `ProductGroup`.