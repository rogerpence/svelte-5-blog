---
title: sveltekit-posting-data-to-an-endpoint
description: sveltekit-posting-data-to-an-endpoint
date_created: '2025-06-20T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
At line 69 I have some stubbed in to call the assignCategoryRule action in +page.server.ts but I don't think that form-based code is correct. I want to pass the categoryData object to the form actcion and then have the assignCategoryRule form action call the post API at /api/update-category


  You're correct: the current form setup is using SvelteKit's form actions, which only send form data (not your `categoryData` object) to the `assignCategoryRule` action. If you want to send the `categoryData` object to your `/api/update-category` endpoint via the form action, you need to:

1. **Send the data from the client to the form action** (as JSON or as form fields).
2. **Have the form action call the API** using `fetch` on the server side.

Here's how you can do it:


### 1. Pass `categoryData` to the form

Since HTML forms only send string fields, you can serialize your `categoryData` as JSON in a hidden input:

````svelte
<!-- ...existing code... -->
<form
  method="POST"
  action="?/assignCategoryRule"
  id={formId}
  use:enhance={() => {
    return async ({ result, formData }) => {
      if (result.type === 'success') {
        console.log(result);
        console.log(formData);
      }
      await applyAction(result);
    };
  }}
>
  <input type="hidden" name="categoryData" value={JSON.stringify(categoryData)} />
  <input type="hidden" name="id" value={formId} />
  <button type="submit">Update</button>
</form>
<!-- ...existing code... -->
````


### 2. Parse and forward the data in the form action

Update your `assignCategoryRule` action to parse the JSON and call the API:

````typescript
// ...existing code...
assignCategoryRule: async ({ request, fetch }) => {
  const rawFormData = Object.fromEntries(await request.formData());
  let categoryData;

  try {
    categoryData = JSON.parse(rawFormData.categoryData as string);
  } catch (err) {
    return fail(400, { message: 'Invalid category data' });
  }

  try {
    // Call the API endpoint on the server
    const apiResponse = await fetch('/api/update-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });

    const apiResult = await apiResponse.json();

    if (!apiResult.success) {
      return fail(500, { message: apiResult.message });
    }

    return { success: true, apiResult };
  } catch (err: any) {
    return fail(500, { message: err.message || 'API call failed' });
  }
}
// ...existing code...
````


**Summary:**
- Serialize your object as a hidden input in the form.
- Parse it in the form action and forward it to your API.

Let me know if you want a more dynamic example for each row, or if you want to use a pure fetch-based approach instead of SvelteKit form actions!