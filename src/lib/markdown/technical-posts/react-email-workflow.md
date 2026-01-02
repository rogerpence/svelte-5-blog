---
title: Work flowfor creating React-Email React Email emails
description: Work flowfor creating React-Email React Email emails
date_created: '2025-06-22T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - react-email
---
### Workflow setup 

Create a file named `wrapper.html` in the folder of your email project (copy it from the root of the `react-email-starter` project). If you're working on this file:

`emails/lakeb2b/1015-06-26/test.tsx`

Create this file: `emails/lakeb2b/1015-06-26/wrapper.html`

Set the iframe src to:
`../../../out/lakeb2b/2025-06-26/test.html`

The preview URL for that email is:

```
http://127.0.0.1:8080/emails/lakeb2b/2025-06-26/wrapper.html
```
### Start the preview
``
1. Start two terminal sessions at the root of the folder `react-email-start`
2. Start live server in one and open a browser to the preview URL for your project.
3. In the other terminal, use  `pnpm watch:export2` to start the 'onchange' file watcher. This launches the react-email 'export' command when file changes are saved.
4. When changes are made to the file you're working, a second or two after saving the file, the browser refreshes to show you the latest changes. 


### send-test-email.js

This file:

```
C:\Users\thumb\Documents\projects\node\send-email\send-test-email.js
```

Sends a test email 

`node send-test-email.js <full test email file name> <to email address(s)>` 

The default 'to' email address is `rp@asna.com`