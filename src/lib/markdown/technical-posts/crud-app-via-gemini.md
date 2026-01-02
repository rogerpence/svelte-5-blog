---
title: CRUD app via Gemini
description: CRUD app via Gemini
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
````
Okay, let's regenerate the SvelteKit 2.0 CRUD application using TypeScript.

**Prerequisites:**

*   Ensure you created your SvelteKit project with TypeScript enabled:
    ```bash
    npm create svelte@latest my-family-crud-ts
    # Choose: Skeleton project, YES to TypeScript, Add ESLint, Add Prettier
    cd my-family-crud-ts
    npm install
    npm install postgres dotenv @types/pg # Install postgres driver and its types
    # If using pnpm or yarn, use appropriate install commands
    ```
*   Set up your `.env` file as described in the JavaScript version.
*   Make sure your `tsconfig.json` is set up correctly (usually handled by `create-svelte`).

**Steps:**

1.  **Database Client Utility (`src/lib/server/db.ts`):**

    ```typescript
    // src/lib/server/db.ts
    import postgres from 'postgres';
    import { DATABASE_URL } from '$env/static/private'; // SvelteKit's env handling

    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set.");
    }

    // Define the interface for the Family record
    export interface Family {
        id: string; // bigint is returned as string by 'postgres' driver
        created_at: Date;
        name: string;
        description: string;
        visual_studio_version: string;
        availability_id: string | null; // bigint FK -> string | null
        group_id: string | null;        // bigint FK -> string | null
        sort_order: number;
        download_page_section_heading: string;
        download_page_order: number;
        release_date: string | null;
    }

    // Define a type for the data used in forms (omitting generated fields)
    export type FamilyFormData = Omit<Family, 'id' | 'created_at'>;
    // Type for errors, mapping field names to error messages
    export type FamilyFormErrors = Partial<Record<keyof FamilyFormData | 'form', string>>;


    // Configure connection options (optional, often inferred from DATABASE_URL)
    const options: postgres.Options<{}> = { // Add type if needed, e.g. <{ my_type: postgres.PostgresType }>
        // ssl: 'require', // Uncomment/configure if your DB requires SSL
        max: 10,          // Max number of connections
        idle_timeout: 30, // Idle timeout in seconds
        // transform: {
        //  undefined: null // Optional: Treat undefined query parameters as NULL
        // }
        // host, port, database, user, password can be added if not in DATABASE_URL
    };

    const sql = postgres(DATABASE_URL, options);

    console.log('PostgreSQL client initialized (TypeScript).');

    export default sql;
    ```

2.  **Form Data Helper (`src/lib/server/formUtils.ts`):**

    ```typescript
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
        const getString = (key: keyof FamilyFormData): string | undefined => formData.get(key as string)?.toString();

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
        if (!values.visual_studio_version) errors.visual_studio_version = 'Visual Studio Version is required';
        if (!values.download_page_section_heading) errors.download_page_section_heading = 'Download Page Section Heading is required';

        // --- Type Conversion & Validation ---

        // Optional BigInt FKs (keep as string)
        values.availability_id = availability_id_str && availability_id_str !== '' ? availability_id_str : null;
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

3.  **Read (List) Page:**
    *   `src/routes/read/+page.server.ts`:
        ```typescript
        // src/routes/read/+page.server.ts
        import sql from '$lib/server/db';
        import type { Family } from '$lib/server/db'; // Import the interface
        import { fail } from '@sveltejs/kit';
        import type { PageServerLoad, Actions } from './$types'; // Import generated types

        // Type the load function using PageServerLoad
        export const load: PageServerLoad = async () => {
            try {
                // Use the generic parameter with sql`` for type safety
                const families = await sql<Omit<Family, 'created_at' | 'availability_id' | 'group_id'>[]>`
                    SELECT id, name, description, visual_studio_version, sort_order, download_page_section_heading, download_page_order, release_date
                    FROM public.family
                    ORDER BY sort_order, name
                `;
                // No need to map IDs if postgres driver returns bigint as string

                return {
                    // families array conforms to the partial Family type selected
                    families: families
                };
            } catch (error: any) {
                console.error('Error loading families:', error);
                // Use fail for recoverable errors expected during load
                return fail(500, { message: `Could not load families. ${error.message || ''}` });
            }
        };

        // Type the Actions object
        export const actions: Actions = {
            // Type the delete action
            delete: async ({ request }) => {
                const data = await request.formData();
                const id = data.get('id')?.toString();

                if (!id) {
                    return fail(400, { message: 'Missing family ID for deletion.' });
                }

                // Basic check if ID looks like a number (since it's string bigint)
                if (!/^\d+$/.test(id)) {
                     return fail(400, { message: 'Invalid family ID format for deletion.' });
                }

                try {
                    const result = await sql`
                        DELETE FROM public.family WHERE id = ${id}
                    `;

                    if (result.count === 0) {
                        // Use status code 404 if not found, still use fail
                        return fail(404, { message: `Family with ID ${id} not found.` });
                    }

                    // Return success status for the UI
                    // Load function re-runs automatically, no need for redirect here
                    return { success: true, deletedId: id };

                } catch (error: any) {
                    console.error(`Error deleting family ${id}:`, error);
                    // Use fail for errors during the action
                    return fail(500, { message: `Failed to delete family ${id}. ${error.message || ''}` });
                }
            }
        };
        ```
    *   `src/routes/read/+page.svelte`:
        ```html
        <script lang="ts"> // Add lang="ts"
            import { enhance } from '$app/forms';
            import type { PageData, ActionData } from './$types'; // Use generated types

            export let data: PageData; // Typed PageData
            export let form: ActionData; // Typed ActionData for form results

            // Type assertion for families if needed, though PageData should handle it
            // $: families = data.families as App.Family[]; // Or use the imported interface if not global

            // Helper for user confirmation
            function confirmDelete(name: string, id: string): boolean {
                 return confirm(`Are you sure you want to delete family "${name}" (ID: ${id})?`);
            }

        </script>

        <svelte:head>
            <title>Read Families</title>
            <!-- Basic Styles - Consider moving to +layout.svelte -->
            <style>
                /* Add or link your styles here */
                 body { font-family: sans-serif; }
                 table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
                 th, td { border: 1px solid #ccc; padding: 0.5em; text-align: left; vertical-align: top;}
                 th { background-color: #eee; }
                 nav { margin-bottom: 1em; }
                 nav a { margin-right: 1em; }
                 .actions form { display: inline-block; margin-left: 10px; }
                 .actions button { color: red; background: none; border: none; padding: 0; font: inherit; cursor: pointer; text-decoration: underline;}
                 .message { margin: 1em 0; padding: 0.8em; border-radius: 4px; }
                 .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                 .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            </style>
        </svelte:head>

        <h1>Family List</h1>

        <nav>
            <a href="/read">Read Families</a>
            <a href="/create">Create New Family</a>
        </nav>

        <!-- Display Action Feedback -->
        {#if form?.message && !form?.success}
            <p class="message error">Error: {form.message}</p>
        {/if}
        {#if form?.success}
             <p class="message success">Family ID {form.deletedId} deleted successfully.</p>
        {/if}

        <!-- Display Load Errors (from fail in load) -->
        {#if data?.message}
             <p class="message error">Error loading data: {data.message}</p>
        {:else if data.families && data.families.length > 0}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>VS Version</th>
                        <th>Sort Order</th>
                        <th>Release Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.families as family (family.id)}
                        <tr>
                            <td>{family.id}</td>
                            <td>{family.name}</td>
                            <td>{family.description}</td>
                            <td>{family.visual_studio_version}</td>
                            <td>{family.sort_order}</td>
                            <td>{family.release_date ?? 'N/A'}</td>
                            <td class="actions">
                                <a href="/update/{family.id}">Edit</a>
                                <!-- Delete Form -->
                                <form method="POST" action="?/delete" use:enhance={() => {
                                    return async ({ cancel }) => {
                                        if (!confirmDelete(family.name, family.id)) {
                                            cancel();
                                        }
                                    };
                                }}>
                                    <input type="hidden" name="id" value={family.id} />
                                    <button type="submit">Delete</button>
                                </form>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else if data.families}
            <p>No families found.</p>
        {/if}

         <a href="/create">Create New Family</a>
        ```

4.  **Create Page:**
    *   `src/routes/create/+page.server.ts`:
        ```typescript
        // src/routes/create/+page.server.ts
        import sql from '$lib/server/db';
        import { fail, redirect } from '@sveltejs/kit';
        import { getFamilyDataFromForm } from '$lib/server/formUtils';
        import type { Actions } from './$types';
        import type { FamilyFormData } from '$lib/server/db'; // Import the form data type

        // No load function needed for a simple create page

        export const actions: Actions = {
            default: async ({ request }) => {
                const formData = await request.formData();
                const { values, errors } = getFamilyDataFromForm(formData);

                if (errors) {
                    // Return validation errors and the submitted values for form repopulation
                    // Use `fail` with status 400 for validation errors
                    return fail(400, { values, errors });
                }

                try {
                    // Destructure values for clarity in the query
                    const {
                        name, description, visual_studio_version, availability_id,
                        group_id, sort_order, download_page_section_heading,
                        download_page_order, release_date
                    } = values;

                    // SQL insertion using tagged template literal for safety
                    await sql`
                        INSERT INTO public.family (
                            name, description, visual_studio_version, availability_id,
                            group_id, sort_order, download_page_section_heading,
                            download_page_order, release_date
                        ) VALUES (
                            ${name}, ${description}, ${visual_studio_version}, ${availability_id},
                            ${group_id}, ${sort_order}, ${download_page_section_heading},
                            ${download_page_order}, ${release_date}
                        )
                    `;
                } catch (error: any) {
                    console.error('Error creating family:', error);
                    // Check for specific DB errors if needed (e.g., unique constraints) using error.code
                    // Return a generic server error message using fail with status 500
                    return fail(500, {
                        values, // Return values for form refill
                        errors: { form: `Database error: Could not create family. ${error.message || ''}` }
                    });
                }

                // Redirect to the list page on success using 303 (See Other)
                throw redirect(303, '/read');
            }
        };
        ```
    *   `src/routes/create/+page.svelte`:
        ```html
        <script lang="ts"> // Add lang="ts"
            import { enhance } from '$app/forms';
            import type { ActionData } from './$types'; // Use generated type

            export let form: ActionData; // Typed ActionData

            // Use form?.values for repopulation, provide defaults matching DB schema
            $: nameValue = form?.values?.name ?? 'Otis';
            $: descriptionValue = form?.values?.description ?? 'Visual Studio 2022 v17.1/11.1 .NET FW';
            $: vsVersionValue = form?.values?.visual_studio_version ?? 'Visual Studio 2022';
            $: availabilityIdValue = form?.values?.availability_id ?? '6';
            $: groupIdValue = form?.values?.group_id ?? '4';
            $: sortOrderValue = form?.values?.sort_order ?? 6000;
            $: headingValue = form?.values?.download_page_section_heading ?? '17.1/11.1 - Visual Studio 2022 .NET Framework Otis Family';
            $: pageOrderValue = form?.values?.download_page_order ?? 3200;
            $: releaseDateValue = form?.values?.release_date ?? '';

        </script>

        <svelte:head>
            <title>Create Family</title>
             <!-- Link to shared styles or add inline -->
            <style>
                 body { font-family: sans-serif; }
                 form { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
                 label { display: block; margin-bottom: 5px; font-weight: bold; }
                 input[type="text"], input[type="number"], textarea {
                     width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
                 }
                 textarea { min-height: 80px; }
                 button { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 1em; }
                 button:hover { background-color: #45a049; }
                 .error-message { color: red; font-size: 0.9em; margin-top: -5px; margin-bottom: 10px; }
                 .form-error { color: red; font-weight: bold; margin-bottom: 15px; border: 1px solid red; padding: 10px; background-color: #ffebeb; border-radius: 4px; }
                 nav { margin-bottom: 1em; }
                 nav a { margin-right: 1em; }
            </style>
        </svelte:head>

        <h1>Create New Family</h1>

         <nav>
            <a href="/read">Read Families</a>
            <a href="/create">Create New Family</a>
        </nav>

        <!-- Display general form error -->
        {#if form?.errors?.form}
            <p class="form-error">{ form.errors.form }</p>
        {/if}

        <form method="POST" use:enhance>
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required bind:value={nameValue}>
                {#if form?.errors?.name}<p class="error-message">{form.errors.name}</p>{/if}
            </div>

            <div>
                <label for="description">Description:</label>
                <textarea id="description" name="description" required bind:value={descriptionValue}></textarea>
                 {#if form?.errors?.description}<p class="error-message">{form.errors.description}</p>{/if}
            </div>

             <div>
                <label for="visual_studio_version">Visual Studio Version:</label>
                <input type="text" id="visual_studio_version" name="visual_studio_version" required bind:value={vsVersionValue}>
                 {#if form?.errors?.visual_studio_version}<p class="error-message">{form.errors.visual_studio_version}</p>{/if}
            </div>

             <div>
                <label for="availability_id">Availability ID (Optional, BigInt as number input):</label>
                <!-- Input type=number for convenience, value is string from DB/form -->
                <input type="number" id="availability_id" name="availability_id" bind:value={availabilityIdValue}>
                {#if form?.errors?.availability_id}<p class="error-message">{form.errors.availability_id}</p>{/if}
            </div>

             <div>
                <label for="group_id">Group ID (Optional, BigInt as number input):</label>
                <input type="number" id="group_id" name="group_id" bind:value={groupIdValue}>
                {#if form?.errors?.group_id}<p class="error-message">{form.errors.group_id}</p>{/if}
            </div>

             <div>
                <label for="sort_order">Sort Order:</label>
                <input type="number" id="sort_order" name="sort_order" required bind:value={sortOrderValue}>
                 {#if form?.errors?.sort_order}<p class="error-message">{form.errors.sort_order}</p>{/if}
            </div>

            <div>
                <label for="download_page_section_heading">Download Page Section Heading:</label>
                <input type="text" id="download_page_section_heading" name="download_page_section_heading" required bind:value={headingValue}>
                 {#if form?.errors?.download_page_section_heading}<p class="error-message">{form.errors.download_page_section_heading}</p>{/if}
            </div>

             <div>
                <label for="download_page_order">Download Page Order:</label>
                <input type="number" id="download_page_order" name="download_page_order" required bind:value={pageOrderValue}>
                 {#if form?.errors?.download_page_order}<p class="error-message">{form.errors.download_page_order}</p>{/if}
            </div>

            <div>
                <label for="release_date">Release Date (YYYY-MM-DD or Text, Optional):</label>
                <input type="text" id="release_date" name="release_date" placeholder="e.g., 2023-10-26 or Q4 2023" bind:value={releaseDateValue}>
                 {#if form?.errors?.release_date}<p class="error-message">{form.errors.release_date}</p>{/if}
            </div>

            <button type="submit">Create Family</button>
        </form>
        ```

5.  **Update Page:**
    *   `src/routes/update/[id]/+page.server.ts`:
        ```typescript
        // src/routes/update/[id]/+page.server.ts
        import sql from '$lib/server/db';
        import type { Family } from '$lib/server/db';
        import { error, fail, redirect } from '@sveltejs/kit';
        import { getFamilyDataFromForm } from '$lib/server/formUtils';
        import type { PageServerLoad, Actions } from './$types';

        export const load: PageServerLoad = async ({ params }) => {
            const { id } = params;

            // Validate ID format (basic check)
            if (!id || !/^\d+$/.test(id)) {
                throw error(400, 'Invalid Family ID provided.'); // Use SvelteKit's error helper
            }

            try {
                // Fetch the specific family, expect exactly one result
                const families = await sql<Family[]>`
                    SELECT * FROM public.family WHERE id = ${id}
                `;

                if (families.length === 0) {
                    throw error(404, `Family with ID ${id} not found.`); // Throw 404 if not found
                }

                const family = families[0];
                // Ensure related IDs are strings or null for the form
                // The driver usually returns bigint as string, but explicit check is safe
                 family.id = String(family.id);
                 family.availability_id = family.availability_id ? String(family.availability_id) : null;
                 family.group_id = family.group_id ? String(family.group_id) : null;

                return { family }; // Return the found family object
            } catch (err: any) {
                // Re-throw SvelteKit HTTP errors, handle others
                if (err.status >= 400 && err.status < 600) throw err;

                console.error(`Error loading family ${id} for update:`, err);
                throw error(500, `Could not load family data for ID ${id}. ${err.message || ''}`);
            }
        };

        export const actions: Actions = {
            default: async ({ request, params }) => {
                const { id } = params; // Get ID from the route parameter
                const formData = await request.formData();
                const { values, errors } = getFamilyDataFromForm(formData);

                // ID check (should always be present here)
                 if (!id || !/^\d+$/.test(id)) {
                     return fail(400, { values, errors: { ...errors, form: 'Family ID is missing or invalid.' }});
                 }

                if (errors) {
                    // Return validation errors + submitted values
                    return fail(400, { id, values, errors }); // Include ID for context if needed
                }

                try {
                    const {
                        name, description, visual_studio_version, availability_id,
                        group_id, sort_order, download_page_section_heading,
                        download_page_order, release_date
                    } = values;

                    const result = await sql`
                        UPDATE public.family
                        SET
                            name = ${name},
                            description = ${description},
                            visual_studio_version = ${visual_studio_version},
                            availability_id = ${availability_id},
                            group_id = ${group_id},
                            sort_order = ${sort_order},
                            download_page_section_heading = ${download_page_section_heading},
                            download_page_order = ${download_page_order},
                            release_date = ${release_date}
                            -- created_at is typically not updated
                        WHERE id = ${id}
                        RETURNING id -- Optionally return ID to confirm update
                    `;

                     if (result.count === 0) {
                        // Should not happen if load worked, but handle defensively
                        return fail(404, {
                            id, values, errors: { form: `Family with ID ${id} not found for update.` }
                        });
                    }

                } catch (err: any) {
                    console.error(`Error updating family ${id}:`, err);
                     return fail(500, {
                        id, values, errors: { form: `Database error: Could not update family ${id}. ${err.message || ''}` }
                    });
                }

                // Redirect back to the list page after successful update
                throw redirect(303, '/read');
            }
        };
        ```
    *   `src/routes/update/[id]/+page.svelte`:
        ```html
        <script lang="ts"> // Add lang="ts"
            import { enhance } from '$app/forms';
            import type { PageData, ActionData } from './$types'; // Use generated types
            import type { Family } from '$lib/server/db'; // Import Family type if needed for casting

            export let data: PageData; // Typed PageData from load()
            export let form: ActionData; // Typed ActionData from actions

            // Prioritize form data (if validation failed) over loaded data
            // Use type assertion or careful checks as ActionData might only have values subset
            $: familyData = (form?.values ?? data.family) as Partial<Family>; // Use Partial as form might not have all fields on error
            $: id = data.family.id; // Get ID from originally loaded data

        </script>

        <svelte:head>
            <title>Update Family {id}</title>
            <!-- Link to shared styles or add inline -->
            <style>
                 body { font-family: sans-serif; }
                 form { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
                 label { display: block; margin-bottom: 5px; font-weight: bold; }
                 input[type="text"], input[type="number"], textarea {
                     width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
                 }
                 textarea { min-height: 80px; }
                 button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 1em; }
                 button:hover { background-color: #0056b3; }
                 .error-message { color: red; font-size: 0.9em; margin-top: -5px; margin-bottom: 10px; }
                 .form-error { color: red; font-weight: bold; margin-bottom: 15px; border: 1px solid red; padding: 10px; background-color: #ffebeb; border-radius: 4px; }
                 nav { margin-bottom: 1em; }
                 nav a { margin-right: 1em; }
                 .cancel-link { margin-top: 1em; display: inline-block;}
            </style>
        </svelte:head>

        <h1>Update Family (ID: {id})</h1>

        <nav>
            <a href="/read">Read Families</a>
            <a href="/create">Create New Family</a>
        </nav>

        <!-- Display general form error -->
        {#if form?.errors?.form}
            <p class="form-error">{ form.errors.form }</p>
        {/if}

        <form method="POST" use:enhance>
            <!-- ID is passed via URL parameter and action context, no hidden input needed -->
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required value={familyData.name ?? ''}>
                {#if form?.errors?.name}<p class="error-message">{form.errors.name}</p>{/if}
            </div>

            <div>
                <label for="description">Description:</label>
                <textarea id="description" name="description" required>{familyData.description ?? ''}</textarea>
                 {#if form?.errors?.description}<p class="error-message">{form.errors.description}</p>{/if}
            </div>

             <div>
                <label for="visual_studio_version">Visual Studio Version:</label>
                <input type="text" id="visual_studio_version" name="visual_studio_version" required value={familyData.visual_studio_version ?? ''}>
                 {#if form?.errors?.visual_studio_version}<p class="error-message">{form.errors.visual_studio_version}</p>{/if}
            </div>

             <div>
                <label for="availability_id">Availability ID (Optional, BigInt as number input):</label>
                <input type="number" id="availability_id" name="availability_id" value={familyData.availability_id ?? ''}>
                {#if form?.errors?.availability_id}<p class="error-message">{form.errors.availability_id}</p>{/if}
            </div>

             <div>
                <label for="group_id">Group ID (Optional, BigInt as number input):</label>
                <input type="number" id="group_id" name="group_id" value={familyData.group_id ?? ''}>
                {#if form?.errors?.group_id}<p class="error-message">{form.errors.group_id}</p>{/if}
            </div>

             <div>
                <label for="sort_order">Sort Order:</label>
                <input type="number" id="sort_order" name="sort_order" required value={familyData.sort_order ?? 6000}>
                 {#if form?.errors?.sort_order}<p class="error-message">{form.errors.sort_order}</p>{/if}
            </div>

            <div>
                <label for="download_page_section_heading">Download Page Section Heading:</label>
                <input type="text" id="download_page_section_heading" name="download_page_section_heading" required value={familyData.download_page_section_heading ?? ''}>
                 {#if form?.errors?.download_page_section_heading}<p class="error-message">{form.errors.download_page_section_heading}</p>{/if}
            </div>

             <div>
                <label for="download_page_order">Download Page Order:</label>
                <input type="number" id="download_page_order" name="download_page_order" required value={familyData.download_page_order ?? 3200}>
                 {#if form?.errors?.download_page_order}<p class="error-message">{form.errors.download_page_order}</p>{/if}
            </div>

            <div>
                <label for="release_date">Release Date (YYYY-MM-DD or Text, Optional):</label>
                <input type="text" id="release_date" name="release_date" placeholder="e.g., 2023-10-26 or Q4 2023" value={familyData.release_date ?? ''}>
                 {#if form?.errors?.release_date}<p class="error-message">{form.errors.release_date}</p>{/if}
            </div>

            <button type="submit">Update Family</button>
        </form>

         <a href="/read" class="cancel-link">Cancel and return to list</a>
        ```

6.  **Root Route Redirect (`src/routes/+page.server.ts`):**

    ```typescript
    // src/routes/+page.server.ts
    import { redirect } from '@sveltejs/kit';
    import type { PageServerLoad } from './$types'; // Use generated type

    // Use PageServerLoad for server-only load functions
    export const load: PageServerLoad = async () => {
        throw redirect(307, '/read'); // 307 Temporary Redirect
    };
    ```

7.  **Layout (`src/routes/+layout.svelte`):** (Ensure script tag has `lang="ts"`)

    ```html
    <!-- src/routes/+layout.svelte -->
    <script lang="ts"> // Add lang="ts"
        import '../app.css'; // Example: import global CSS
        // Layout-level TypeScript logic can go here if needed
    </script>

    <style>
        /* Basic global styles - Adapt as needed */
        :global(body) {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4; /* Light background */
            color: #333;
            line-height: 1.6;
        }

        .layout-container {
            max-width: 1100px;
            margin: 2rem auto;
            padding: 1rem 2rem 2rem 2rem;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }

        nav.main-nav {
            background-color: #e9ecef; /* Light grey nav */
            padding: 0.8rem 1.5rem;
            border-bottom: 1px solid #dee2e6;
            margin-bottom: 1.5rem;
            border-radius: 8px 8px 0 0; /* Match container */
        }

        nav.main-nav a {
            margin-right: 1rem;
            text-decoration: none;
            font-weight: 500;
            color: #0056b3; /* Slightly darker blue */
            padding: 0.3rem 0;
            border-bottom: 2px solid transparent;
            transition: color 0.2s ease, border-bottom-color 0.2s ease;
        }

        nav.main-nav a:hover,
        nav.main-nav a[aria-current='page'] { /* Style for active link */
            color: #003d80;
            border-bottom-color: #0056b3;
        }

        main {
            padding: 0 1rem; /* Add padding inside main content area */
        }

        /* Common button style */
        button, a.button-link {
             display: inline-block;
             padding: 0.6em 1.2em;
             border: none;
             border-radius: 4px;
             cursor: pointer;
             font-size: 1em;
             text-decoration: none;
             text-align: center;
             transition: background-color 0.2s ease;
             margin-right: 0.5em; /* Spacing between buttons */
        }
        button[type="submit"] { background-color: #28a745; color: white; } /* Green for Create/Update */
        button[type="submit"]:hover { background-color: #218838; }
        a.button-link { background-color: #007bff; color: white; } /* Blue for links like Edit */
        a.button-link:hover { background-color: #0056b3; }
        button.delete-btn { background-color: #dc3545; color: white; } /* Red for Delete */
        button.delete-btn:hover { background-color: #c82333; }

    </style>

    <div class="layout-container">
        <nav class="main-nav">
             <!-- Consider using SvelteKit's page store for active link styling -->
            <a href="/read" aria-current={$page.url.pathname === '/read' ? 'page' : undefined}>Read Families</a>
            <a href="/create" aria-current={$page.url.pathname === '/create' ? 'page' : undefined}>Create New Family</a>
        </nav>

        <main>
            <slot></slot> <!-- Page content goes here -->
        </main>
    </div>
    ```
    *Note: Added `$page` store usage for active link styling in the layout.* Make sure to import it: `import { page } from '$app/stores';` in the layout's script tag.

8.  **Run:**
    ```bash
    npm run dev -- --open
    ```

This provides the same functionality as the JavaScript version but leverages TypeScript for better type safety, code completion, and maintainability. Remember to run `npm run check` periodically to catch any type errors.
````