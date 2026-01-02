---
title: How to set the locale at ASNA.com
description: How to set the locale at ASNA.com
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - asna-com
---
## Setting the locale

The current local is hardcoded in the `+layout.server.js` file in each locale's root folder. The `+layout.server.js` is shown below for the `en` locale.

`+layout.server.js`

```
// @ts-nocheck
import { superValidate } from 'sveltekit-superforms/server';
import contactFormSchema from '$components/contact-form/contact-form-schema.js';

export const prerender = true;
export const csr = true;

const user = {
	showContactUsForm: false,
	contactUsFormTitle: '',
	contactUsFormSource: '',
	contactUsTargetUrl: '',
	emailKey: '',
	locale: 'en',
	showBeta: false,
	saveDownloadInfo: false,
	showFlash: false
};

export const load = async (request, event) => {
	const form = await superValidate(contactFormSchema);

	return {
		form,
		user
	};
};
```

## Getting the locale from userState

The current locale is then available from the `userState` store.

```
import { setUserState, getUserState } from '$lib/userState';

const state = getUserState()
const locale = $state.locale
```