---
title: Creating marketing emails with mjml
description: Creating marketing emails with mjml
date_created: '2025-06-11T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - marketing
  - email
---
I think mjml is pretty much a dead product. But it might have a little value in seeing the HTML its abstracted components produce. 

To install:

```
npm init -y
pnpm add mjml
```

Add this as the first test email: `test.mjml`

```
import mjml2html from 'mjml' /* Compile an mjml string */ const htmlOutput =
mjml2html(`
<mjml>
    <mj-body>
        <mj-section>
            <mj-column>
                <mj-text> Hello World!dd </mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
</mjml>
`, options) /* Print the responsive HTML generated and MJML errors if any */
console.log(htmlOutput)
```

Start two terminal tabs at project root: 
- Open live server in one

To compile `test.mjml` to `test.html`

```
npx mjml test.mjml -o test.html 
```

To watch for changes and see them with live server:

```
npx mjml -w test.mjml 
```