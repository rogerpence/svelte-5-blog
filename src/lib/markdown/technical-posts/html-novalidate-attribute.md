---
title: html-novalidate-attribute
description: html-novalidate-attribute
date_created: '2025-06-02T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - html
---
The `novalidate` attribute, when applied to an HTML `<form>` element, tells the browser **not to perform its built-in client-side validation** on the form's input fields before submission.

Here's a breakdown:

1.  **Default Browser Validation:**
    *   Modern browsers have built-in mechanisms to validate form inputs based on HTML5 attributes like `required`, `type="email"`, `type="url"`, `pattern`, `min`, `max`, `minlength`, `maxlength`, etc.
    *   If an input fails this validation (e.g., a `required` field is empty, or an email field doesn't look like an email), the browser will typically prevent the form from submitting and display an error message (often as a tooltip or bubble) near the invalid field.

2.  **What `novalidate` Does:**
    *   When you add `novalidate` to your `<form>` tag, you are essentially saying, "Browser, don't worry about your default validation rules for this form. I'll handle it, or I don't want client-side validation right now."
    *   The form will submit even if, according to the browser's default rules, some fields are invalid.

**Syntax:**

It's a boolean attribute. Its presence means it's active.

```html
<form action="/submit-data" method="post" novalidate>
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>

  <button type="submit">Submit</button>
</form>
```

In the example above, even though the email and name fields are `required`, if they are left empty and `novalidate` is present, the browser will *not* stop the form submission due to these fields being empty.

**Why Use `novalidate`?**

1.  **Custom JavaScript Validation:**
    *   You might want to implement your own, more sophisticated, or stylistically different validation logic using JavaScript. The browser's default validation messages and behavior might interfere with your custom implementation.
2.  **Server-Side Validation Only:**
    *   While client-side validation is great for user experience (providing immediate feedback), **server-side validation is absolutely crucial for security and data integrity.** You might decide to rely solely on server-side validation, though this generally leads to a poorer user experience if errors aren't caught until after a page reload.
3.  **Testing/Debugging:**
    *   During development, you might want to temporarily disable client-side validation to test server-side error handling or other backend logic without being blocked by the browser.
4.  **Specific User Experience Flows:**
    *   For certain flows, like saving a draft of a form that isn't yet complete, you might want to allow submission even if some fields don't meet final validation criteria.

**Important Considerations:**

*   **Server-Side Validation is a Must:** `novalidate` only affects client-side validation. Malicious users (or even just users with JavaScript disabled) can bypass client-side validation. Always validate data on the server.
*   **User Experience:** If you use `novalidate` to implement custom validation, ensure your custom solution provides clear and accessible error messages to the user. If you use it to bypass client-side validation entirely, users might submit data, get an error from the server, and lose their input, which is frustrating.

In summary, `novalidate` gives developers control over when and how client-side form validation occurs, typically to allow for custom JavaScript validation solutions or to bypass it for specific reasons.