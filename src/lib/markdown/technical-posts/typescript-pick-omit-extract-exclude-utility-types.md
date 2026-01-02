---
title: Typescript's pick - omit - extract - exclude - utility types
description: Typescript's pick - omit - extract - exclude - utility types
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
> [!info]
> extract and exclude work only on on union types.

These are powerful built-in utility types in TypeScript that help you construct new types from existing ones:

**1. `Pick<Type, Keys>` and `Omit<Type, Keys>` (for Object Properties)**

-   **`Pick<Type, Keys>`:**

    -   **Purpose:** Creates a new type by selecting a set of specific properties (`Keys`) from an existing object `Type`.
    -   **Think:** "I want to **pick** only these properties from this object type."
    -   **Example:**
        ```typescript
        interface User {
            id: number;
            name: string;
            email: string;
            isAdmin: boolean;
        }
        type UserPreview = Pick<User, "id" | "name">;
        // UserPreview is { id: number; name: string; }
        ```

-   **`Omit<Type, Keys>`:**
    -   **Purpose:** Creates a new type by taking all properties from an existing object `Type` and then removing a specific set of properties (`Keys`).
    -   **Think:** "I want all properties from this object type, but **omit** (remove) these."
    -   **Example:**
        ```typescript
        interface User {
            id: number;
            name: string;
            email: string;
            isAdmin: boolean;
        }
        type UserEditableFields = Omit<User, "id" | "isAdmin">;
        // UserEditableFields is { name: string; email: string; }
        ```
-   **Key Idea:** `Pick` and `Omit` are opposites. Both operate on the _keys_ of an object type.

**2. `Extract<Type, Union>` and `Exclude<Type, Union>` (for Union Members)**

-   **`Extract<Type, Union>`:**

    -   **Purpose:** Creates a new type by selecting members from a `Type` (usually a union type) that are assignable to `Union`.
    -   **Think:** "I want to **extract** (keep) only the types from this union that are also part of this other union/type."
    -   **Example:**

        ```typescript
        type AllShapes = "circle" | "square" | "triangle" | "line";
        type RoundShapes = Extract<AllShapes, "circle" | "oval">;
        // RoundShapes is "circle"
        // (because "oval" wasn't in AllShapes, and "square", "triangle", "line" aren't in "circle" | "oval")

        type T0 = Extract<string | number | (() => void), Function>;
        // T0 is () => void
        ```

-   **`Exclude<Type, Union>`:**

    -   **Purpose:** Creates a new type by removing members from a `Type` (usually a union type) that are assignable to `Union`.
    -   **Think:** "I want all types from this union, but **exclude** (remove) any that are part of this other union/type."
    -   **Example:**

        ```typescript
        type AllShapes = "circle" | "square" | "triangle" | "line";
        type NonRoundShapes = Exclude<AllShapes, "circle" | "oval">;
        // NonRoundShapes is "square" | "triangle" | "line"

        type T1 = Exclude<string | number | (() => void), Function>;
        // T1 is string | number
        ```

-   **Key Idea:** `Extract` and `Exclude` are opposites. Both operate on the _members_ of a union type, filtering them based on another type/union.

**In a Nutshell:**

-   **`Pick`/`Omit`:** Work with **object properties/keys**.
    -   `Pick`: Selects specified keys.
    -   `Omit`: Removes specified keys.
-   **`Extract`/`Exclude`:** Work with **members of a union type**.
    -   `Extract`: Selects union members assignable to a given type.
    -   `Exclude`: Removes union members assignable to a given type.