---
title: Target mso and not mso targets
description: Target mso and not mso targets
date_created: '2025-07-23T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - outlook
  - mso
---
> [!info]
> See the RowSpacer component for an example of this syntax in action.

### Targeting MSO Environments

To include content specifically for Microsoft Outlook, the following syntax is used:

```html
<!--[if mso]>
  ... content for MSO clients ...
<![endif]-->
```

This code leverages conditional comments, a feature originally introduced by Microsoft for Internet Explorer and also supported by the Word-based rendering engine used in many versions of Outlook. Other email clients will interpret this block as a standard HTML comment and ignore the content within.

### Targeting Non-MSO Environments

To include content for email clients *other* than Microsoft Outlook, the syntax is slightly different:

```html
<!--[if !mso]><!-->
  ... content for non-MSO clients ...
<!--<![endif]-->
```

Here's a breakdown of why this specific syntax is necessary:

*   `<!--[if !mso]>`: This is a conditional comment that targets environments that are **not** Microsoft Outlook.
*   `<!-->`: This is a crucial part of the syntax. For non-MSO clients, this closes the initial comment, allowing them to render the content that follows. Outlook, however, will see the `[if !mso]` condition as false and will ignore everything until it finds the `<![endif]-->`.
*   `<!--`: This opens a new comment just before the closing conditional.
*   `<![endif]-->`: This closes the conditional for Outlook and the new comment for other clients.

This clever use of comments ensures that only non-MSO clients will render the enclosed HTML.

In summary, the syntax you've inquired about is the standard and correct approach for handling the rendering differences in Outlook and other email clients, a common challenge in HTML email development.