---
title: Displaying toasts with Sveltekit
description: Displaying toasts with Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - asna-com
---
`FlashMessage` is a small Svelte component that displays a flash message.

A JavaScript object defaults a flash message with four properties.

```
let options = {
	duration: 4000,
	message: 'Your message here',
    state: "success",
    manualClose: true
};
```

The properties are (the default values are shown above):

-   `duration` - time to show the message in milliseconds
-   `message`- message text. This is the only required property.
-   `state` - one of: success | fail | info | warning. These states govern the icon and accent of a toast. See example below.
-   `manualClose` - if true, the user can close the toast by clicking on the 'x' in the upper right-hand corner. If false, the 'x' isn't shown and the user can't explicitly close the toast.

success:
![[toast-ok.png]]

fail:
![[toast-error.png]]

info:
![[toast-information.png]]

warning:
![[toast-exclamation.png]]

A small progress bar at the bottom of the toast counts down the toast's display duration.

## Declaring a FlashMessage

1. Add the `FlashMessage.svelte` file to `lib/components` folder.
2. Add the `flashstore.js` file to the `lib./components` folder.
3. Import the `FlashMessage` component in a top-level `+layout.svelte` file.
4. Add the `<FlashMessage/>` tag to the `+layout.svelte` file.
5. Add FlashMessage.css to your project.

For example, the `+layout.svelte` file would look like this:

```
<script>
    import FlashMessage from "$lib/components/FlashMessage.svelte";
    ...
</script>

<FlashMessage/>
<slot/>
```

## Using FlashMessage

1. Import the `{flashMessage}` store in the `+page.svelte` file
2. Assign a `FlashMessage` object to the `$flashMessage` store. You only need to declare the properties of the `FlassMessage` that you want changed from the default values.

```
<script>

    import { flashMessage } from "$lib/components/flashstore";

	if (some_condition) {
	    $flashMessage = {
            state: "info",
            message: "The data appears to be correct",
            duration: 6000,
	     };
    }

</script>
```

The `FlashMessage` component subscribes to the `flashMessage` store and when it sees that one has been added, it displays it.

The above code would display an `info` message for 6 seconds. The toast could be closed by the user (because the `manualClose` property default is `true`).

## Conditional toast display

Using query string values is a good way to get flash messages displayed.

```
<script>
import { page } from '$app/stores';
import { flashMessage } from "$lib/components/flashstore";

if ($page.url.searchParams.has('emailflash')) {
    const email = $page.url.searchParams.get('email')

    $flashMessage = {
        state: "info",
        message: `An email confirming your request was sent to ${email}`,
        duration: 4000,
    };
}
</script>
```

In the example above, the `emailflash` key indicates a flash message needs to be sent and the email address to display in the toast text is provided with the `email` key.

> Discuss here how flash conditions with special query string values could be used in the `+layout.svelte` file to display flash messages on the next request.

## Limitations

-   You can't display more than one toast at a time. (this may be a future enhancement)
-   The toast position is hardcoded to top center of the page.