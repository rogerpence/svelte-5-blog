---
title: sveltekit-template-page-server-ts
description: sveltekit-template-page-server-ts
date_created: '2025-05-26T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
```
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

import { gotoRegistrantFormSchema as formSchema } from '$lib/form-schema/gotoRegistrantFormSchema';
import type { WebinarRegistrationFormData, GotoWebinarResponse } from '$lib/types/goto-webinar';

export const load: PageServerLoad = async ({ cookies }) => {
    let formData = {
        company: 'ASNA',
        first_name: 'Roger',
        last_name: 'Pence',
        email: 'rp@asna.com'
    };

    return { formData };
};

export const actions: Actions = {
    create: async (event) => {
        const rawFormData = Object.fromEntries(await event.request.formData()) as WebinarRegistrationFormData;

        try {
            // Have Zod validate the form with its schema.
            const formData = formSchema.parse(rawFormData) as WebinarRegistrationFormData;

            if (registrationInfo.success) {
                throw redirect(303, '/success');
            }

            return {
                registrationInfo
            };
        } catch (err: any) {
            // Fetch the Zod errors:
            const { fieldErrors: errors } = err.flatten();

            return fail(400, {
                data: rawFormData,
                registrationInfo,
                errors
            });
        }
    }
};
```