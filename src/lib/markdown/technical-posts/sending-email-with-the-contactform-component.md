---
title: Sending email from ASNA.com
description: Sending email from ASNA.com
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - asna-com
  - email
---
## Properties

| Name        | Default        | Purpose                                                                                                           |
| ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| buttonText  | "Send comment" | Submit button text                                                                                                |
| emailSource | \*None         | Page or context email was sent from. Provides context for admin email copy                                        |
| hideComment | false          | Hide the `textarea` tag                                                                                           |
| modalDialog | undefined      | If using the Modal component, and a reference to that `Modal` is necessary, this is a reference to that component |
| questions   | []             | Array of questions (max three questions) to ask on the form                                                       |
| subject     | \*None         | Email subject                                                                                                     |
| title       | "Title here"   | Form title                                                                                                        |

Notes:

-   If the `questions` array is empty no questions are displayed.
-   The `emailSource` provides ASNA admin's context to the email. For example, the "Contact us today to discuss your IBM i challenge" contact form `emailSource` would be "IBM i challenge comment from home page."
-   The `hideComment` property is silly. The whole point of the form is to ask a question!
-   The `ContactForm` will almost certainly be wrapped in the `Modal` component--the `modalDialog` property is a reference to the `Modal` component. This is used mostly for passing a 'close' button click back to the `Modal` component.

## Sending email

When the contact form's submit button is clicked, that invokes the `sendemail` action in the root `+page.server.js` file. `+page.server.js` imports `ssendEmail` from the `$lib/sendemail.js` file which provides the logic needed to send an email.

## Sending a generic email from ASNA.com

The `$lib/stores.js` file defines stores that, when set to true, cause the generic email form to be displayed.

```
import { writable } from 'svelte/store';

export const showContactTechSupport = writable(false);
export const showContactIBMChallenge = writable(false);
export const showContactGeneric = writable(false);
export const showUnsubscribe = writable(false);
```

The root `+layout.svelte` file tests each store

```
$: if ($showContactTechSupport) {
		title = 'Contact ASNA Tech Support';
		emailSource = 'Contact Support';
		subject = 'Thank you for your email to ASNA tech support!';
		showModal = true;
		$showContactTechSupport = false;
	}

```

```
<BannerRpgToNet {locale} on:click={() => ($showContactIBMChallenge = true)} />
```