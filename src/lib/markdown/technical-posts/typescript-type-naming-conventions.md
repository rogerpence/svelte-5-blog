---
title: TypeScript type naming conventions
description: TypeScript type naming conventions
date_created: '2025-07-03T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
## Common Conventions:

### 1. **Suffix Convention** (Most Popular):
````typescript
import { z } from 'zod';

export const categoryRulesSchema = z.object({
	id: z.number().int().nullable(),
	description: z.string().nullable(),
	rule: z.string().nullable(),
	value: z.string().nullable(),
	category: z.string().nullable()
});

// Database/Table type
export type CategoryRulesEntity = z.infer<typeof categoryRulesSchema>;

// Runtime/Application types
export type CategoryRulesDto = Omit<CategoryRulesEntity, 'id'> & {
	description: string;
	rule: string;
	value: string;
	category: string;
};

export type CategoryRulesRequest = Omit<CategoryRulesEntity, 'id'>;
export type CategoryRulesResponse = Required<CategoryRulesEntity>;
````

### 2. **Prefix Convention**:
````typescript
// Database types
export type DbCategoryRules = z.infer<typeof categoryRulesSchema>;
export type DbUser = { id: number; email: string | null; /* ... */ };

// Application types
export type CategoryRules = Required<Omit<DbCategoryRules, 'id'>>;
export type User = { id: number; email: string; /* ... */ };
````

### 3. **Namespace/Module Convention**:
````typescript
export namespace DB {
	export type CategoryRules = z.infer<typeof categoryRulesSchema>;
}

export namespace App {
	export type CategoryRules = Required<Omit<DB.CategoryRules, 'id'>>;
}

// Usage:
// const dbRecord: DB.CategoryRules = ...;
// const appData: App.CategoryRules = ...;
````

### 4. **Folder Structure Convention**:
````
src/lib/types/
├── entities/          # Database table types
│   ├── CategoryRules.ts
│   └── User.ts
├── dtos/             # Data transfer objects
│   ├── CategoryRulesDto.ts
│   └── UserDto.ts
└── api/              # API request/response types
    ├── CategoryRulesApi.ts
    └── UserApi.ts
````

## **Recommended Approach** (Suffix Convention):

````typescript
import { z } from 'zod';

export const categoryRulesSchema = z.object({
	id: z.number().int().nullable(),
	description: z.string().nullable(),
	rule: z.string().nullable(),
	value: z.string().nullable(),
	category: z.string().nullable()
});

// Database entity (matches physical table)
export type CategoryRulesEntity = z.infer<typeof categoryRulesSchema>;

// Application DTOs (Data Transfer Objects)
export type CategoryRulesDto = Required<Omit<CategoryRulesEntity, 'id'>>;
export type CategoryRulesCreateDto = Omit<CategoryRulesEntity, 'id'>;
export type CategoryRulesUpdateDto = Partial<Omit<CategoryRulesEntity, 'id'>> & { id: number };
````

## Common Suffixes:
- **`Entity`** - Database table representation
- **`Dto`** - Data Transfer Object (API/runtime)
- **`Model`** - Domain model
- **`Request`** - API request payload
- **`Response`** - API response payload
- **`Create`** - For creation operations
- **`Update`** - For update operations

## Usage in your code:
````typescript
import type { CategoryRulesEntity, CategoryRulesDto } from '$lib/types/CategoryRules';

// Database query returns entities
const dbResult: CategoryRulesEntity[] = result.recordset;

// Transform to DTOs for the frontend
const datarows: CategoryRulesDto[] = dbResult.map(entity => ({
	description: entity.description || '',
	rule: entity.rule || '',
	value: entity.value || '',
	category: entity.category || ''
}));
````

This convention makes it immediately clear whether you're working with database data (nullable, includes IDs) or application data (processed, non-nullable).