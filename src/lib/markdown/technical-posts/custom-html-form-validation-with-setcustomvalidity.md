---
title: HTML form custom validation with setCustomValidity
description: HTML form custom validation with setCustomValidity
date_created: '2025-06-02T00:00:00.000Z'
date_updated: '2025-09-30T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - html
---
see

```
C:\Users\thumb\Documents\projects\asna\_asna.com\_project_ocho\src\components\all-locales\all-pages\landing-page-form.svelte
```

for this code used in a Svelte component.

The `setCustomValidity(message)` method is a powerful part of the HTML5 Constraint Validation API. It allows you to programmatically set a custom validation message for a form control element (like `<input>`, `<textarea>`, or `<select>`), thereby marking it as invalid.

Here's a breakdown:

1.  **Purpose:**
    *   To define custom validation rules beyond what HTML5 attributes (`required`, `pattern`, `min`, `max`, `type="email"`, etc.) can offer.
    *   To provide user-friendly, specific error messages for these custom rules.
    *   To integrate your custom JavaScript validation logic with the browser's native validation UI (e.g., error bubbles, styling with `:invalid` CSS pseudo-class).

2.  **How it Works:**
    *   **`element.setCustomValidity(messageString)`:**
        *   If `messageString` is a **non-empty string**:
            *   The `element` is considered **invalid**.
            *   The `element.validity.customError` property becomes `true`.
            *   The `element.validationMessage` property will return your `messageString`.
            *   The browser will typically prevent form submission (if the form doesn't have `novalidate`) and display this `messageString` as an error (e.g., in a tooltip) when validation is triggered (e.g., on submit, or if `element.reportValidity()` is called).
        *   If `messageString` is an **empty string (`""`)**:
            *   The custom validity error is **cleared**.
            *   The `element.validity.customError` property becomes `false`.
            *   The element is now considered valid *with respect to this custom check*.
            *   **Crucially:** If other built-in constraints (like `required` or `type="email"`) are still violated, the element will remain invalid, but the `validationMessage` will revert to the browser's default message for those other constraints. If no other constraints are violated, the element becomes fully valid.

3.  **Key Elements Involved:**
    *   **Form Control Elements:** `<input>`, `<textarea>`, `<select>`, `<button>`.
    *   **`validity` Property:** An object ( `ValidityState`) on the form control element. It has boolean properties like `valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`, `rangeOverflow`, `customError`, and a general `valid` property.
    *   **`validationMessage` Property:** A string containing the error message that the browser would display for the current invalid state. This will be your custom message if `customError` is true.
    *   **`checkValidity()` Method:** Returns `true` if the element is valid, `false` otherwise. It does *not* display any UI.
    *   **`reportValidity()` Method:** Checks validity and, if invalid, reports the error to the user (e.g., shows the error bubble) and returns `false`. Returns `true` if valid.

**Example: Password Confirmation**

A common use case is validating that two password fields match.

```html
<form id="signupForm">
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required minlength="8">
  </div>
  <div>
    <label for="confirmPassword">Confirm Password:</label>
    <input type="password" id="confirmPassword" name="confirmPassword" required>
    <span class="error-message" id="confirmPasswordError"></span>
  </div>
  <button type="submit">Sign Up</button>
</form>

<script>
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const form = document.getElementById('signupForm');

  function validatePasswords() {
    if (passwordInput.value !== confirmPasswordInput.value) {
      // Set a custom error message on the confirmPassword field
      confirmPasswordInput.setCustomValidity("Passwords do not match.");
    } else {
      // Clear the custom error message (important!)
      confirmPasswordInput.setCustomValidity("");
    }
  }

  // Validate on input in the confirm password field
  confirmPasswordInput.addEventListener('input', validatePasswords);
  // Also validate when the main password changes, as it might make the confirmation valid/invalid
  passwordInput.addEventListener('input', () => {
    // Re-run validation, which might trigger setCustomValidity on confirmPasswordInput
    validatePasswords();
    // Optionally, to make the browser re-check and potentially show/hide errors immediately:
    // confirmPasswordInput.reportValidity();
  });

  form.addEventListener('submit', function(event) {
    // Run custom validations one last time before submit
    validatePasswords();

    // Manually check all fields and report validity if you're not relying solely on browser default submit behavior
    if (!form.checkValidity()) {
      event.preventDefault(); // Prevent submission
      // You might want to loop through invalid fields and call reportValidity() on them
      // or display errors in a custom way.
      // For simplicity, the browser will often show errors on invalid fields on submit attempt.
      console.log("Form is invalid.");
    } else {
      console.log("Form submitted (simulated).");
      event.preventDefault(); // Prevent actual submission for this demo
    }
  });
</script>
```

**Why is `setCustomValidity("")` so important?**

If you set a custom error message and the condition that caused the error is later resolved, you **must** call `setCustomValidity("")` to clear that custom error. Otherwise, the field will remain marked as invalid with your custom message, even if it technically meets all criteria.

**When to use `setCustomValidity`:**

*   When HTML5 built-in validation attributes are insufficient (e.g., comparing two fields, complex business logic).
*   When you want to provide more specific or user-friendly error messages than the browser defaults.
*   When you want to integrate your custom validation logic seamlessly with the browser's validation UI and the `:valid`/`:invalid` CSS states.

It's a fundamental tool for creating robust and user-friendly client-side form validation.