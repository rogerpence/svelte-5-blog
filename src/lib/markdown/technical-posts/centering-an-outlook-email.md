---
title: Centering an Outlook email
description: Centering an Outlook email
date_created: '2025-07-06T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - email
  - email-builder
---
The issue is that Outlook for Windows doesn't respect the CSS centering properties the same way other email clients do. Looking at your HTML, I can see you're using `text-align: center` and `margin: 0 auto`, but Outlook needs specific table-based centering.

Here are the fixes for Outlook:

## **Fix 1: Add MSO-specific centering wrapper**

Add this around your main email table:

```html
<!--[if mso | IE]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td align="center" valign="top">
<![endif]-->

<!-- Your existing email content here -->
<div class="layout svelte-defrnu">
    <div style="margin:0 auto;padding:0;background-color: transparent; text-align: center; max-width: 600px;">
        <!-- ... rest of your email content ... -->
    </div>
</div>

<!--[if mso | IE]>
</td>
</tr>
</tbody>
</table>
<![endif]-->
```

## **Fix 2: Update your EmailWrapper component**

In your EmailWrapper component, modify the structure:

```svelte
<!-- EmailWrapper.svelte -->
<style>
    /* ... existing styles ... */
    .email-container {
        margin: 0 auto !important;
        text-align: center;
        width: 100% !important;
        max-width: 600px;
    }
</style>

<!--[if mso | IE]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" style="text-align: center;">
<![endif]-->

<div class="email-container">
    <table role="presentation" style="margin: 0 auto; width: 600px; max-width: 600px; border-collapse: collapse;">
        <tbody>
            <tr>
                <td align="center" style="padding: 0;">
                    <!-- Your email content -->
                    <slot />
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!--[if mso | IE]>
</td>
</tr>
</tbody>
</table>
<![endif]-->
```

## **Fix 3: Add Outlook-specific CSS**

Add this to your email head styles:

```html
<style type="text/css">
    /* Outlook-specific centering */
    .ExternalClass {
        width: 100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
        line-height: 100%;
    }
    
    /* Force Outlook to center */
    table.email-wrapper {
        margin: 0 auto !important;
    }
    
    /* Outlook DPI fix */
    [class="x_email-container"] {
        margin: 0 auto !important;
        text-align: center !important;
    }
</style>

<!--[if mso]>
<style type="text/css">
    table {
        margin: 0 auto !important;
    }
    .email-container {
        margin: 0 auto !important;
        text-align: center !important;
    }
</style>
<![endif]-->
```

## **Fix 4: The most reliable approach - Ghost table wrapper**

Replace your current wrapper with this Outlook-compatible structure:

```html
<!--[if mso | IE]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td align="center" valign="top" width="600" style="width: 600px;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px;">
<tbody>
<tr>
<td align="center" valign="top">
<![endif]-->

<div style="margin: 0 auto; max-width: 600px; text-align: center;">
    <!-- Your email content -->
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
        <tbody>
            <tr>
                <td>
                    <!-- All your existing email content goes here -->
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!--[if mso | IE]>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<![endif]-->
```

## **Quick Fix for your current code:**

Add this wrapper around your existing `.layout` div:

```html
<!--[if mso | IE]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td align="center" valign="top">
<![endif]-->

<div class="layout svelte-defrnu">
    <!-- Your existing content -->
</div>

<!--[if mso | IE]>
</td>
</tr>
</tbody>
</table>
<![endif]-->
```

**The key issue:** Outlook ignores `margin: 0 auto` and CSS-based centering. It only respects table-based centering with `align="center"` attributes and MSO conditional comments.

Try **Fix 4 (Ghost table wrapper)** first - it's the most reliable solution for Outlook centering issues.

Similar code found with 1 license type