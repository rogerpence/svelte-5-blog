---
title: Miscellaneous tech notes about HTML forms and Sveltekit--especially regarding typescript. It also touches briefly on Zod.
description: Miscellaneous tech notes about HTML forms and Sveltekit--especially regarding typescript. It also touches briefly on Zod.
date_created: 2025-05-21T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - typescript
  - forms
  - svelte
---
## Why you need Zod! 

[[zod-technical-notes]]

I had AI generate some form handling code to see what it would say. Gemini generated the code salad below.  The code is mostly silly because Zod does pretty much all of this. However, I kept the code because of its use of TypeScript.  

I found this line particularly interesting:

```ts
const getString = (key: keyof FamilyFormData): string | undefined => formData.get(key as string)?.toString();
```

It gets a key value from a `formData` object. If the key value is null or undefined the function "short-circuits." The toString() method is not called, and the function evaluates to undefined. If the value is anything else (a "truthy" value or a "falsy" value like 0, "", false that is not null or undefined): The operation continues, and the function returns the `toString()` value of the key value found.

```ts
const name = getString('name') ?? '';
```


Code that Gemini produced

```ts
// src/lib/server/formUtils.ts
import type { FamilyFormData, FamilyFormErrors } from './db'; // Import types

interface FormParseResult {
	values: FamilyFormData;
	errors: FamilyFormErrors | null;
}

/**
 * Extracts and sanitizes family data from FormData for Create/Update.
 * Handles type conversions and null values. Returns typed values and errors.
 * @param formData The FormData object from the request.
 * @returns Object containing sanitized values and potential validation errors.
 */
export function getFamilyDataFromForm(formData: FormData): FormParseResult {
	const values: Partial<FamilyFormData> = {}; // Use Partial initially
	const errors: FamilyFormErrors = {};

	// Helper to safely get string values
	const getString = (key: keyof FamilyFormData): string | undefined =>
		formData.get(key as string)?.toString();

	values.name = getString('name') ?? '';
	values.description = getString('description') ?? '';
	values.visual_studio_version = getString('visual_studio_version') ?? '';
	values.download_page_section_heading = getString('download_page_section_heading') ?? '';

	const availability_id_str = getString('availability_id');
	const group_id_str = getString('group_id');
	const sort_order_str = getString('sort_order');
	const download_page_order_str = getString('download_page_order');
	values.release_date = getString('release_date') || null; // Handle empty string as null

	// --- Basic Validation ---
	if (!values.name) errors.name = 'Name is required';
	if (!values.description) errors.description = 'Description is required';
	if (!values.visual_studio_version)
		errors.visual_studio_version = 'Visual Studio Version is required';
	if (!values.download_page_section_heading)
		errors.download_page_section_heading = 'Download Page Section Heading is required';

	// --- Type Conversion & Validation ---

	// Optional BigInt FKs (keep as string)
	values.availability_id =
		availability_id_str && availability_id_str !== '' ? availability_id_str : null;
	values.group_id = group_id_str && group_id_str !== '' ? group_id_str : null;

	// Sort Order (required number, default 6000)
	if (sort_order_str === undefined || sort_order_str === '') {
		errors.sort_order = 'Sort order is required';
		values.sort_order = 6000; // Use default even on error for form refill
	} else {
		const parsed = parseInt(sort_order_str, 10);
		if (isNaN(parsed)) {
			errors.sort_order = 'Sort order must be a valid number';
			values.sort_order = 6000; // Default
		} else {
			values.sort_order = parsed;
		}
	}

	// Download Page Order (required number, default 3200)
	if (download_page_order_str === undefined || download_page_order_str === '') {
		errors.download_page_order = 'Download page order is required';
		values.download_page_order = 3200; // Default
	} else {
		const parsed = parseInt(download_page_order_str, 10);
		if (isNaN(parsed)) {
			errors.download_page_order = 'Download page order must be a valid number';
			values.download_page_order = 3200; // Default
		} else {
			values.download_page_order = parsed;
		}
	}

	// Clean up release date (allow empty string -> null)
	if (values.release_date && values.release_date.trim() === '') {
		values.release_date = null;
	}

	// --- Final Check ---
	const hasErrors = Object.keys(errors).length > 0;

	// Cast to final type, ensuring all required fields are present (even if derived from defaults)
	// This relies on defaults being set correctly above.
	const finalValues = values as FamilyFormData;

	return {
		values: finalValues,
		errors: hasErrors ? errors : null
	};
}

```