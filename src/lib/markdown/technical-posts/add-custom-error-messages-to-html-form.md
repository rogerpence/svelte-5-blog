---
title: Add custom error messages to HTML forms using the intrinsic error messaging.
description: Add custom error messages to HTML forms using the intrinsic error messaging.
date_created: '2025-06-01T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - html
---
See also: 

[[html-novalidate-attribute| What does HTML's novalidate attribute do]]

```html
<form id="myForm" novalidate> {/* Add novalidate here */}
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <!-- No need for extra error spans if you ONLY want the browser tooltip -->
    </div>

    <div>
        <label for="promo_code">Promo Code (optional, must be "SAVE10" if entered):</label>
        <input type="text" id="promo_code" name="promo_code">
    </div>

    <div>
        <label for="age">Age (must be 18 or over):</label>
        <input type="number" id="age" name="age" required>
    </div>

    <button type="submit">Submit</button>
</form>    
```

```js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('myForm');
    const usernameInput = document.getElementById('username');
    const promoCodeInput = document.getElementById('promo_code');
    const ageInput = document.getElementById('age');

    form.addEventListener('submit', function (event) {
        // Always prevent default submission when novalidate is used,
        // as we're handling validation display ourselves.
        event.preventDefault();

        let isFormCurrentlyValid = true; // Track overall validity

        // --- Username Validation (example: cannot be "admin") ---
        // 1. Clear any previous custom error for this field
        usernameInput.setCustomValidity('');
        // 2. Perform your custom validation
        if (usernameInput.value.trim().toLowerCase() === 'admin') {
            const customMessage = 'Username "admin" is not allowed.';
            usernameInput.setCustomValidity(customMessage); // Set custom message
            isFormCurrentlyValid = false;
        }
        // 3. Also check built-in constraints (like 'required') for this field.
        //    setCustomValidity will override the 'required' message if set.
        //    If username is empty AND value is 'admin' (impossible but for logic):
        //    The 'admin' message takes precedence.
        //    If username is empty AND value is not 'admin':
        //    The 'required' message (or a custom one if set for empty) will show.
        if (!usernameInput.checkValidity()) { // Checks HTML5 + custom
            isFormCurrentlyValid = false;
        }


        // --- Promo Code Validation (example: must be "SAVE10" if not empty) ---
        promoCodeInput.setCustomValidity('');
        if (promoCodeInput.value.trim() !== '' && promoCodeInput.value.trim().toUpperCase() !== 'SAVE10') {
            const customMessage = 'Invalid promo code. If entered, it must be "SAVE10".';
            promoCodeInput.setCustomValidity(customMessage);
            isFormCurrentlyValid = false;
        }
        if (!promoCodeInput.checkValidity()) {
             isFormCurrentlyValid = false;
        }

        // --- Age Validation (example: must be 18 or over) ---
        ageInput.setCustomValidity('');
        const age = parseInt(ageInput.value, 10);
        if (ageInput.value.trim() !== '' && !isNaN(age) && age < 18) { // Check if not empty before age check
            const customMessage = 'You must be at least 18 years old.';
            ageInput.setCustomValidity(customMessage);
            isFormCurrentlyValid = false;
        } else if (ageInput.validity.valueMissing) { // Specifically for 'required'
            // You could set a custom 'required' message here if you want
            // ageInput.setCustomValidity("Please enter your age.");
            // isFormCurrentlyValid = false;
        }
        if (!ageInput.checkValidity()) {
            isFormCurrentlyValid = false;
        }


        // --- Now, trigger the browser's validation UI ---
        if (!isFormCurrentlyValid) {
            // form.reportValidity() will find the FIRST invalid field
            // (based on HTML5 constraints OR your setCustomValidity message),
            // display its validation message bubble, and focus that field.
            form.reportValidity();
        } else {
            // Form is valid according to all client-side checks (HTML5 + custom)
            console.log('Form is valid! Submitting to server...');
            // Here you would typically submit the form, e.g., via AJAX
            // or by removing 'novalidate' and calling form.submit() if that's your flow
            // For this example, let's just log:
            // form.submit(); // This would now bypass client-side re-validation if novalidate was temporarily removed
        }
    });

    // --- Clear custom validity messages on input (important for good UX) ---
    [usernameInput, promoCodeInput, ageInput].forEach(input => {
        input.addEventListener('input', function () {
            // Only clear if it was a custom error you set.
            // HTML5 validation messages (like for 'required') will clear automatically
            // when the condition is met (e.g., field is filled).
            if (this.validity.customError) {
                this.setCustomValidity('');
            }
            // You might also want to re-validate on input for immediate feedback
            // or just let the next submit attempt catch it.
        });
    });
});
```


## A Sveltekit translation

The vanilla JavaScript client-side validation above translated into a SvelteKit component.

The core principles remain the same:
1.  Get references to your form and input elements (using `bind:this` in Svelte).
2.  Attach a submit handler to the form.
3.  In the submit handler, prevent default submission, run your validation logic using `setCustomValidity()`, and then call `formElement.reportValidity()`.
4.  Attach input listeners to clear custom validity messages.

Here's how you can do it in a Svelte component (e.g., `src/routes/my-form/+page.svelte` or a reusable component):

```ts
<script>
  import { onMount } from 'svelte';

  // References to the DOM elements
  let formElement;
  let usernameInput;
  let promoCodeInput;
  let ageInput;

  // Optional: bind values if you need them for other reactive purposes in Svelte
  // let usernameValue = '';
  // let promoCodeValue = '';
  // let ageValue = '';

  function validateForm() {
    let isFormCurrentlyValid = true;

    // --- Username Validation ---
    usernameInput.setCustomValidity(''); // Clear previous custom error
    if (usernameInput.value.trim().toLowerCase() === 'admin') {
      const customMessage = 'Username "admin" is not allowed.';
      usernameInput.setCustomValidity(customMessage);
      isFormCurrentlyValid = false;
    }
    if (!usernameInput.checkValidity()) { // Check HTML5 + custom
      isFormCurrentlyValid = false;
    }

    // --- Promo Code Validation ---
    promoCodeInput.setCustomValidity('');
    if (promoCodeInput.value.trim() !== '' && promoCodeInput.value.trim().toUpperCase() !== 'SAVE10') {
      const customMessage = 'Invalid promo code. If entered, it must be "SAVE10".';
      promoCodeInput.setCustomValidity(customMessage);
      isFormCurrentlyValid = false;
    }
    if (!promoCodeInput.checkValidity()) {
      isFormCurrentlyValid = false;
    }

    // --- Age Validation ---
    ageInput.setCustomValidity('');
    const age = parseInt(ageInput.value, 10);
    if (ageInput.value.trim() !== '' && !isNaN(age) && age < 18) {
      const customMessage = 'You must be at least 18 years old.';
      ageInput.setCustomValidity(customMessage);
      isFormCurrentlyValid = false;
    } else if (ageInput.validity.valueMissing) {
      // Example: You could set a custom required message here if you override default
      // ageInput.setCustomValidity("Please provide your age.");
      // isFormCurrentlyValid = false;
    }
    if (!ageInput.checkValidity()) {
      isFormCurrentlyValid = false;
    }

    return isFormCurrentlyValid;
  }

  function handleSubmit(event) {
    // We added novalidate to the form, so we always handle validation display.
    // We don't necessarily need to preventDefault() if we're *not* using SvelteKit's use:enhance
    // and want the browser to submit *after* our validation.
    // However, if we *are* using use:enhance, or want to fully control submission (e.g., via fetch),
    // then preventDefault() is good. For now, let's keep it to ensure reportValidity() is the one
    // controlling the user flow on error.

    const isFormValid = validateForm();

    if (!isFormValid) {
      event.preventDefault(); // Prevent submission if client-side errors exist
      formElement.reportValidity(); // Show the browser's validation UI
    } else {
      // Form is client-side valid.
      console.log('Form is client-side valid! Proceeding with submission...');
      // If you're using SvelteKit form actions (method="POST"),
      // and client validation passed, the form will now submit.
      // If you're using `use:enhance`, this logic would typically be *inside* the enhance callback.
      // If you wanted to submit via fetch manually:
      // event.preventDefault();
      // const formData = new FormData(formElement);
      // fetch('/your-endpoint', { method: 'POST', body: formData })
      //   .then(...)
      //   .catch(...);
    }
  }

  onMount(() => {
    // --- Clear custom validity messages on input ---
    const inputsForCustomClear = [usernameInput, promoCodeInput, ageInput];
    inputsForCustomClear.forEach(input => {
      if (input) { // Ensure the element is bound and exists
        input.addEventListener('input', function() {
          // `this` refers to the input element here
          if (this.validity.customError) {
            this.setCustomValidity('');
          }
        });
      }
    });
  });
</script>

<style>
  /* Style for invalid inputs (works with browser validation and setCustomValidity) */
  input:invalid {
    border-color: #d9534f; /* A bootstrap-like danger red */
  }
  label {
    display: block;
    margin-top: 10px;
    margin-bottom: 3px;
  }
  button {
    margin-top: 15px;
  }
</style>

<!--
  Add `novalidate` to prevent default browser validation UI from appearing
  before our custom logic runs.
  If using SvelteKit form actions, set `method="POST"`.
-->
<form
  bind:this={formElement}
  on:submit={handleSubmit}
  novalidate
  method="POST" action="?/submitMyForm" {/* Example SvelteKit action */}
>
  <div>
    <label for="username">Username:</label>
    <input
      type="text"
      id="username"
      name="username"
      bind:this={usernameInput}
      required
      placeholder="e.g. john_doe"
      aria-describedby="usernameHint"
    />
    <!-- <small id="usernameHint">Username cannot be 'admin'.</small> -->
  </div>

  <div>
    <label for="promo_code">Promo Code (optional, must be "SAVE10" if entered):</label>
    <input
      type="text"
      id="promo_code"
      name="promo_code"
      bind:this={promoCodeInput}
      placeholder="e.g. SAVE10"
    />
  </div>

  <div>
    <label for="age">Age (must be 18 or over):</label>
    <input
      type="number"
      id="age"
      name="age"
      bind:this={ageInput}
      required
      placeholder="e.g. 25"
    />
  </div>

  <button type="submit">Submit</button>
</form>
```

**Key SvelteKit/Svelte changes:**

1.  **`bind:this={elementVariable}`:** This is how Svelte gives you a direct reference to the DOM element, replacing `document.getElementById()`.
2.  **`on:submit={handleSubmit}`:** This is Svelte's event handling syntax.
3.  **`onMount`:** Similar to `DOMContentLoaded`, `onMount` runs after the component has been rendered to the DOM. It's a good place to add vanilla event listeners if needed, especially if you need the `this` context of the vanilla listener or are interacting with elements that Svelte might not directly control.
4.  **`novalidate` attribute on `<form>`:** Essential for taking full control of when validation messages appear.
5.  **`handleSubmit` function:**
    *   It calls `validateForm()` which contains your core validation logic.
    *   If `validateForm()` returns `false` (invalid), it calls `event.preventDefault()` and then `formElement.reportValidity()` to show the browser's native error tooltip for the first invalid field (including your custom messages).
    *   If `validateForm()` returns `true` (valid), the form will proceed with its default action (e.g., submitting to a SvelteKit form action if `method="POST"` is set).
6.  **SvelteKit Form Actions:** The example `<form method="POST" action="?/submitMyForm">` assumes you might have a corresponding action in `+page.server.js` or `+server.js`. Your client-side validation acts as a progressive enhancement before the data is sent to the server.

**To use this with SvelteKit's `use:enhance` for a smoother UX (optional):**

If you want to use SvelteKit's `enhance` action for progressive enhancement (e.g., submitting without a full page reload), you'd modify the `handleSubmit` or integrate the validation into the `enhance` callback.

```ts
<script>
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms'; // Import enhance

  // ... (rest of your script: element bindings, validateForm, onMount for input listeners) ...
  // let formElement, usernameInput, promoCodeInput, ageInput;

  // handleSubmit is no longer directly needed if using enhance for submission logic
</script>

<!-- ... (style tag) ... -->

<form
  bind:this={formElement}
  method="POST"
  action="?/submitMyForm"
  use:enhance={() => {
    // This function is called BEFORE the form submission request is made
    const isClientValid = validateForm();

    if (!isClientValid) {
      formElement.reportValidity(); // Show browser validation UI

      // Cancel SvelteKit's enhanced submission
      return ({ cancel }) => {
        cancel();
      };
    }

    // If client-side validation passes, proceed with SvelteKit's enhanced submission
    return async ({ result, update }) => {
      // This function is called AFTER the server action responds
      console.log('Server responded:', result);
      // `update` will re-run load functions and update the page if needed
      // based on the server action's result (e.g., if it invalidates data)
      await update();
    };
  }}
  novalidate
>
  <!-- ... (your input fields) ... -->
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" bind:this={usernameInput} required />
  </div>
  <div>
    <label for="promo_code">Promo Code (optional, must be "SAVE10" if entered):</label>
    <input type="text" id="promo_code" name="promo_code" bind:this={promoCodeInput} />
  </div>
  <div>
    <label for="age">Age (must be 18 or over):</label>
    <input type="number" id="age" name="age" bind:this={ageInput} required />
  </div>
  <button type="submit">Submit</button>
</form>
```

This `use:enhance` approach is more idiomatic for SvelteKit if you're also handling the form submission with server-side actions, as it integrates client-side validation neatly before the fetch request is made. Choose the approach that best fits your needs! The first example is a more direct translation of your vanilla JS into a Svelte component structure.


Ah, you are absolutely correct! My apologies. I was overly focused on the *structure* of returning a function for cancellation and for the post-submission handler, and I misremembered/misstated how `cancel` is provided for the *immediate pre-submission cancellation scenario*.

You are right, for the case where you want to cancel the submission *before it even happens* (within the initial `enhance` callback), SvelteKit **does** provide `cancel` directly as a property of the argument to that main callback.

Here is the corrected understanding and code:

**Corrected `use:enhance` for Immediate Pre-Submission Cancellation:**

```svelte
<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  let formElement;
  let usernameInput;

  function validateForm() {
    console.log('validateForm CALLED');
    if (usernameInput && usernameInput.value.trim().toLowerCase() === 'admin') {
      console.log('validateForm: Username is "admin", setting custom validity and returning false');
      usernameInput.setCustomValidity('Username "admin" is not allowed.');
      return false;
    }
    if (usernameInput) usernameInput.setCustomValidity('');
    console.log('validateForm: All checks passed, returning true');
    return true;
  }

  onMount(() => {
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            if (this.validity.customError) {
                this.setCustomValidity('');
            }
        });
    }
  });
</script>

<form
  bind:this={formElement}
  method="POST"
  action="?/yourAction"
  use:enhance={({ cancel, formData, action, submitter }) => { // <<-- CORRECT: `cancel` is provided here
    console.log('--- Enhance: Pre-submission callback started ---');
    console.log('Enhance: Argument received by main callback:', { cancel, formData, action, submitter });

    const isClientValid = validateForm();
    console.log('Enhance: isClientValid =', isClientValid);

    if (!isClientValid) {
      console.log('Enhance: Client validation FAILED. Reporting validity and calling cancel().');
      formElement.reportValidity(); // Show browser validation UI

      // CORRECT WAY TO CANCEL IMMEDIATELY:
      if (typeof cancel === 'function') {
        cancel(); // Call the `cancel` function provided directly to this callback
      } else {
        console.error("Enhance: ERROR - `cancel` was not provided or not a function in the main callback argument!");
      }
      return; // Explicitly return to stop further processing in this callback
              // Though calling cancel() should already prevent submission.
    }

    console.log('Enhance: Client validation PASSED. Returning post-submission handler.');
    // If client-side validation passes, proceed with SvelteKit's enhanced submission
    // You STILL return a function here for the AFTER-submission logic.
    return async ({ result, update }) => {
      console.log('Enhance: Post-submission handler CALLED. Server responded:', result);
      // `result` contains: { type: 'success', status: 200, data: ... } or { type: 'error', ... } or { type: 'redirect', ... }
      // `update` is a function to tell SvelteKit to re-run load functions and update the page.
      await update();
    };
  }}
  novalidate
>
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" bind:this={usernameInput} required />
  </div>
  <button type="submit">Submit</button>
</form>
```


The call to cancel() above is wrong! 








Ah, you are absolutely correct! My apologies. I was overly focused on the *structure* of returning a function for cancellation and for the post-submission handler, and I misremembered/misstated how `cancel` is provided for the *immediate pre-submission cancellation scenario*.

You are right, for the case where you want to cancel the submission *before it even happens* (within the initial `enhance` callback), SvelteKit **does** provide `cancel` directly as a property of the argument to that main callback.

Here is the corrected understanding and code:

**Corrected `use:enhance` for Immediate Pre-Submission Cancellation:**

```svelte
<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  let formElement;
  let usernameInput;

  function validateForm() {
    console.log('validateForm CALLED');
    if (usernameInput && usernameInput.value.trim().toLowerCase() === 'admin') {
      console.log('validateForm: Username is "admin", setting custom validity and returning false');
      usernameInput.setCustomValidity('Username "admin" is not allowed.');
      return false;
    }
    if (usernameInput) usernameInput.setCustomValidity('');
    console.log('validateForm: All checks passed, returning true');
    return true;
  }

  onMount(() => {
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            if (this.validity.customError) {
                this.setCustomValidity('');
            }
        });
    }
  });
</script>

<form
  bind:this={formElement}
  method="POST"
  action="?/yourAction"
  use:enhance={({ cancel, formData, action, submitter }) => { // <<-- CORRECT: `cancel` is provided here
    console.log('--- Enhance: Pre-submission callback started ---');
    console.log('Enhance: Argument received by main callback:', { cancel, formData, action, submitter });

    const isClientValid = validateForm();
    console.log('Enhance: isClientValid =', isClientValid);

    if (!isClientValid) {
      console.log('Enhance: Client validation FAILED. Reporting validity and calling cancel().');
      formElement.reportValidity(); // Show browser validation UI

      // CORRECT WAY TO CANCEL IMMEDIATELY:
      if (typeof cancel === 'function') {
        cancel(); // Call the `cancel` function provided directly to this callback
      } else {
        console.error("Enhance: ERROR - `cancel` was not provided or not a function in the main callback argument!");
      }
      return; // Explicitly return to stop further processing in this callback
              // Though calling cancel() should already prevent submission.
    }

    console.log('Enhance: Client validation PASSED. Returning post-submission handler.');
    // If client-side validation passes, proceed with SvelteKit's enhanced submission
    // You STILL return a function here for the AFTER-submission logic.
    return async ({ result, update }) => {
      console.log('Enhance: Post-submission handler CALLED. Server responded:', result);
      // `result` contains: { type: 'success', status: 200, data: ... } or { type: 'error', ... } or { type: 'redirect', ... }
      // `update` is a function to tell SvelteKit to re-run load functions and update the page.
      await update();
    };
  }}
  novalidate
>
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" bind:this={usernameInput} required />
  </div>
  <button type="submit">Submit</button>
</form>
```

**Why my previous explanations were slightly off (and why your correction is key):**

The `enhance` function has a flexible API:

1.  **For Immediate Cancellation (Pre-Submission):**
    *   The primary callback you provide to `use:enhance` is given an argument object which includes `cancel`, `formData`, `action`, and `submitter`.
    *   If you decide here (e.g., due to client-side validation) that the submission should not proceed *at all*, you call `cancel()` directly from *this* scope.
    *   You then typically `return;` or don't return anything that SvelteKit interprets as a post-submission handler.

2.  **For Handling the Server Response (Post-Submission):**
    *   If the primary callback *doesn't* call `cancel()` and instead wants to proceed with the submission and then handle the server's response, it **must return an async function**.
    *   This *returned async function* will then be called by SvelteKit *after* the server responds, and SvelteKit will pass *it* an argument object containing `result`, `update`, and `formData`.

I was conflating the two return mechanisms. You are absolutely right that for the immediate "stop the submission right now" case, `cancel` is available in the primary callback's argument.

Thank you so much for the persistence and the clear correction! This is a subtle but very important distinction in how `use:enhance` works. I'll be sure to remember this more clearly.

This corrected version should now work as you intend, and the "cancel is not a function" error should be resolved if it was due to trying to call `cancel` in the wrong place based on my previous, slightly muddled, explanation.