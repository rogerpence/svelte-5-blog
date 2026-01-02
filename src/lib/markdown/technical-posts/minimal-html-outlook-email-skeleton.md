---
title: minimal-html-outlook-email-skeleton
description: minimal-html-outlook-email-skeleton
date_created: '2025-06-26T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - html
  - outlook
---
- Do not use margins... ever
- Do all "margin" work with cell padding
- Bec


Of course. Crafting an email template for Outlook's Word-based rendering engine is an exercise in defensive coding. The "phantom horizontal lines" are a notorious issue, often caused by a combination of background colors, odd-numbered element heights, and Outlook's interpretation of `font-size` and `line-height`.

This template is designed to be as minimal and robust as possible, specifically targeting and mitigating those issues.

### Key Strategies to Avoid Outlook Phantom Lines

1.  **`border-collapse: collapse;`**: Applied to all tables to prevent weird spacing between cells.
2.  **`mso-table-lspace: 0pt; mso-table-rspace: 0pt;`**: Prevents Outlook from adding extra, unwanted space around tables.
3.  **`mso-line-height-rule: exactly;`**: Forces Outlook to respect your specified `line-height` instead of guessing. This is one of the most critical fixes.
4.  **Matching Background Colors**: The `<body>` has a background color that matches the main content wrapper. If a 1px gap appears, it will be filled with the same color, making it invisible.
5.  **Table-Based Bullets**: Using `<ul>` and `<li>` tags is a recipe for disaster in Outlook. We will create "fake" bullets using a nested table where one column holds the bullet (`&bull;`) and the other holds the text. This gives us pixel-perfect control.
6.  **VML Namespace**: Including the VML (Vector Markup Language) namespaces in a conditional comment helps Outlook render things more predictably.
7.  **Explicit `line-height`**: Every element containing text has an explicit `line-height` set in pixels or points, which is more reliable than relative units like `em` or `%` in Outlook.


### Minimal HTML Email Template for Outlook

Here is the code. Copy and paste this into an `.html` file. The content goes inside the `<!-- CONTENT START -->` section.

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Email Title</title>

  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->

  <style type="text/css">
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f2f2f2; /* Match this with the outer table bgcolor */
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
      mso-line-height-rule: exactly;
    }
    /* A good-to-have reset for other clients */
    img {
      border: 0;
      -ms-interpolation-mode: bicubic;
    }
  </style>

</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f2f2f2; mso-line-height-rule: exactly;">

  <!-- Full-width background color wrapper -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#f2f2f2">
  <tbody>
    <tr>
      <td align="center">
        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">
        <tbody>
        <tr>
        <td style="line-height:0;font-size:0;mso-line-height-rule:exactly;">
        <![endif]-->

        <!-- Main content container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; max-width:600px; margin:0 auto; background-color:#ffffff;">
        <tbody>
          <!-- THIS IS YOUR SINGLE TR -->
          <tr>
            <!-- THIS IS YOUR SINGLE TD FOR CONTENT -->
            <td align="left" style="padding: 30px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">

              <!-- CONTENT START -->

              <p style="margin: 0 0 20px 0;">Here is a list of items for your review:</p>

              <!-- FAKE BULLET LIST USING A TABLE - THIS IS THE SAFEST WAY FOR OUTLOOK -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tbody>
                <!-- Bullet Item 1 -->
                <tr>
                  <td valign="top" style="width: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                    &bull;&nbsp;
                  </td>
                  <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                    This is the first bullet point. It is rendered inside a table cell for maximum compatibility and control over spacing.
                  </td>
                </tr>

                <!-- Spacer Row -->
                <tr><td height="10" style="font-size:1px; line-height:10px;">&nbsp;</td></tr>

                <!-- Bullet Item 2 -->
                <tr>
                  <td valign="top" style="width: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                    &bull;&nbsp;
                  </td>
                  <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                    The second bullet point follows the same robust pattern.
                  </td>
                </tr>

                <!-- Spacer Row -->
                <tr><td height="10" style="font-size:1px; line-height:10px;">&nbsp;</td></tr>

                <!-- Bullet Item 3 -->
                <tr>
                  <td valign="top" style="width: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                    &bull;&nbsp;
                  </td>
                  <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                    By controlling every element with tables, we prevent Outlook's rendering engine from making poor decisions.
                  </td>
                </tr>
              </tbody>
              </table>

              <!-- CONTENT END -->

            </td>
          </tr>
	    </tbody>
        </table>

        <!--[if mso | IE]>
        </td>
        </tr>
        </tbody>
        </table>
        <![endif]-->

      </td>
    </tr>
  </tbody>
  </table>

</body>
</html>
```

Adding an image row

Of course. Here is a robust, Outlook-safe table row for a heading image, built with the same defensive principles as the skeleton.

It includes a clickable link, fluid/responsive behavior for modern clients, and specific fixes to prevent spacing and line issues in Outlook.

### The HTML for the Header Image Row

Simply place this `<tr>` inside your main content `<table>`, likely as the very first row before your content `<td>`.

```html
<!-- HEADER IMAGE ROW -->
<tr>
  <!-- This cell contains the image. Padding is 0 to avoid extra space. -->
  <!-- The font-size and line-height are set to 0 to prevent Outlook from adding phantom space below the image. -->
  <td align="center" style="padding: 0; font-size: 0px; line-height: 0px;">

    <!-- The link makes the entire image clickable. -->
    <a href="https://www.yourwebsite.com" target="_blank" style="text-decoration: none; border: 0;">

      <!--
        - The `width` attribute is for Outlook. It should match your image's native width.
        - The `style` width/max-width makes the image responsive for mobile clients.
        - `display: block;` is critical to remove the gap below the image in clients like Gmail.
        - `alt` text is for accessibility and when images are blocked.
      -->
      <img
        src="https://via.placeholder.com/600x150/CCCCCC/FFFFFF?text=Your+Logo+Here"
        alt="Your Company Logo"
        width="600"
        border="0"
        style="display: block; width: 100%; max-width: 600px; height: auto;"
      />

    </a>

  </td>
</tr>
<!-- /HEADER IMAGE ROW -->
```

### Key Features and Why They Matter

1.  **`<td>` Reset (`font-size: 0px; line-height: 0px;`)**: This is the most important defense against phantom spacing issues in Outlook. It collapses the cell's "line box," ensuring that only the image itself contributes to the cell's height.

2.  **`<img>` Styling (`display: block;`)**: This is a universal fix that removes the small gap that most email clients and browsers add below an image by default (treating it as an inline text element).

3.  **Fluid-Hybrid Image**:
    *   **`width="600"`**: The `width` **attribute** is a hard instruction for Outlook. It ensures your image renders at the correct size and doesn't get distorted.
    *   **`style="width: 100%; max-width: 600px;"`**: The **CSS `width`** property allows the image to shrink proportionally on smaller screens (like phones), making it responsive. The `max-width` prevents it from ever growing larger than its original size.

4.  **Clickable Wrapper (`<a>`)**: The link wraps the image, and its `display: block;` style ensures the entire area of the image is clickable, not just some part of it. `text-decoration: none;` and `border: 0;` prevent any unwanted styling (like a blue underline or border) from appearing.

By using this structure, you get an image that is both pixel-perfect and stable in Outlook while remaining flexible and modern for all other clients.

## Using background colors

Excellent question. This is one of the most fundamental and frequently misunderstood aspects of HTML email development.

**The short answer is: YES, you apply the background color to each `<td>` individually, NOT the `<tr>`.**

Applying styles to a `<tr>` is highly unreliable and will fail in many email clients, most notably Outlook. Think of the `<tr>` as a logical grouping element, while the `<td>` is the actual visual container that gets rendered.


### The Best Practice: The "Belt and Suspenders" `<td>` Method

For maximum compatibility, you should use **both** the HTML `bgcolor` attribute and the CSS `background-color` property on the `<td>` itself.

*   **`bgcolor="#eeeeee"`**: This is the "old school" attribute that is read by legacy clients like Outlook.
*   **`style="background-color: #eeeeee;"`**: This is the modern CSS property that is respected by clients like Apple Mail, Gmail, and most web clients.

By using both, you ensure your color renders everywhere.

#### Example: A Single-Column Row with a Background Color

Here's how you would create a content row with a light gray background. Notice the color is applied directly to the cell.

```html
<!-- ROW WITH BACKGROUND COLOR -->
<tr>
  <!-- Apply bgcolor for Outlook and background-color for modern clients -->
  <td
    align="left"
    bgcolor="#f7f7f7"
    style="padding: 20px; background-color: #f7f7f7; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;"
  >
    This is my content within a cell that has a background color. This method is the most reliable across all email clients.
  </td>
</tr>
<!-- /ROW WITH BACKGROUND COLOR -->
```

#### Example: A Multi-Column Row

If your row has multiple columns and you want them all to have the same background, you must apply the `bgcolor` and `style` to **every single `<td>`** in that row.

```html
<!-- MULTI-COLUMN ROW WITH BACKGROUND COLOR -->
<tr>
  <!-- Column 1 -->
  <td
    align="left"
    width="50%"
    bgcolor="#f7f7f7"
    style="padding: 20px; background-color: #f7f7f7; font-family: Arial, sans-serif;"
  >
    Left Column Content
  </td>

  <!-- Column 2 -->
  <td
    align="left"
    width="50%"
    bgcolor="#f7f7f7"
    style="padding: 20px; background-color: #f7f7f7; font-family: Arial, sans-serif;"
  >
    Right Column Content
  </td>
</tr>
<!-- /MULTI-COLUMN ROW WITH BACKGROUND COLOR -->
```
If you forget one, you'll see a white gap in that cell.


### Advanced Technique: The Full-Width "Wrapper Table"

A common requirement is to have a background color that spans the entire width of the email client's window, while the content inside remains constrained to a 600px width.

The `<td>` method is still the key, but you achieve this with a nested table structure.

1.  **Outer Table (Fluid):** A `100%` width table. The `<td>` of this table gets the full-width background color.
2.  **Inner Table (Fixed):** A `600px` width table nested inside the first one. This holds your actual content.

Here's the bulletproof code for that:

```html
<!-- FULL-WIDTH BACKGROUND ROW -->
<tr>
  <td align="center" bgcolor="#dddddd" style="background-color: #dddddd; padding: 20px 0;">

    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">
    <tr>
    <td>
    <![endif]-->

    <!-- Inner Content Table -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
      <tr>
        <td align="left" bgcolor="#ffffff" style="background-color: #ffffff; padding: 30px; font-family: Arial, sans-serif;">
          My content is on a white background, but this entire section is inside a full-width gray stripe.
        </td>
      </tr>
    </table>

    <!--[if mso | IE]>
    </td>
    </tr>
    </table>
    <![endif]-->

  </td>
</tr>
<!-- /FULL-WIDTH BACKGROUND ROW -->
```

### Summary:

*   **Always apply color to the `<td>`**.
*   Use **both** the `bgcolor` attribute and the `background-color` CSS property.
*   If a row has multiple `<td>`s, **apply the color to all of them**.
*   For full-width color stripes, use the **nested wrapper table pattern**.

## Centering content

Excellent question. Centering content, especially images, is a fundamental task in email design, and doing it robustly for Outlook requires a specific approach.

The best and most reliable method is to **use the parent `<td>` to control the alignment**. You apply alignment attributes and styles to the table cell, which then dictates how the content inside it should be positioned.


### The Golden Rule for Centering in Email

**Control alignment from the container, not the content.** The most bulletproof container in HTML email is the `<td>`.

Here are the three primary scenarios and how to handle them.

### Method 1: Centering an Image (Most Common)

To center an image, you set its parent `<td>` to be centered. This works because an image is treated like a single, large character (an "inline" element).

**Use `align="center"` on the `<td>`.** For good measure, also add the CSS `text-align: center;`.

```html
<!-- ROW WITH A CENTERED IMAGE -->
<tr>
  <!--
    1. align="center" is the key for Outlook.
    2. text-align: center; is the CSS for modern clients.
    3. We give it padding to create some space around the image.
  -->
  <td align="center" style="padding: 20px; text-align: center;">

    <!-- This is the image itself. It will obey the alignment of the parent <td>. -->
    <a href="https://www.yourwebsite.com" target="_blank" style="text-decoration: none; border: 0;">
      <img
        src="https://via.placeholder.com/300x100/CCCCCC/FFFFFF?text=Centered+Image"
        alt="A nicely centered image"
        width="300"
        border="0"
        style="display: block; width: 100%; max-width: 300px; height: auto;"
      />
    </a>

  </td>
</tr>
<!-- /ROW WITH A CENTERED IMAGE -->
```

**Why this works:** The `<td>` creates a "line box" that spans its full width. `align="center"` tells Outlook to place any content inside that box in the middle. `text-align: center;` does the same for modern clients like Gmail and Apple Mail.


### Method 2: Centering Text

This follows the exact same principle as centering an image. You apply the centering rules to the parent `<td>`.

```html
<!-- ROW WITH CENTERED TEXT -->
<tr>
  <td
    align="center"
    style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;"
  >
    This line of text will be perfectly centered. <br />
    And so will this second line.
  </td>
</tr>
<!-- /ROW WITH CENTERED TEXT -->
```


### Method 3: Centering a "Block" of Content (e.g., A Button or a Card)

This is the most advanced case. What if you want to center something that has its own width, like a button (which is often a small table)? You can't just `align="center"` the button table itself.

The solution is to wrap it. You put your content block inside a `<td>` that is set to `align="center"`.

Here’s how to center a bulletproof button:

```html
<!-- ROW WITH A CENTERED BUTTON -->
<tr>
  <!-- The parent cell's only job is to center whatever is inside it. -->
  <td align="center" style="padding: 20px 0; text-align: center;">

    <!-- This is our button, built with a table for maximum compatibility. -->
    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <!-- This is the visible button cell. -->
        <td align="center" bgcolor="#007bff" style="background-color: #007bff; border-radius: 5px;">
          <a
            href="https://www.yourwebsite.com"
            target="_blank"
            style="font-size: 16px; font-family: sans-serif; color: #ffffff; text-decoration: none; display: inline-block; padding: 12px 24px; border-radius: 5px;"
          >
            Click Here
          </a>
        </td>
      </tr>
    </table>

  </td>
</tr>
<!-- /ROW WITH A CENTERED BUTTON -->
```
**Why this works:** The outer `<td>` is told to center its contents. The inner `<table>` (our button) is the content. The outer `<td>` dutifully centers the entire button table. This pattern is essential for creating centered, multi-column layouts within a full-width row.

### Summary: Why This Is the Best Way

1.  **Maximum Compatibility:** The `align` attribute on a `<td>` is one of the oldest and most universally supported pieces of HTML, especially in email clients like Outlook.
2.  **Reliability:** It avoids modern CSS like Flexbox or `margin: auto;`, which have spotty or nonexistent support in many email clients.
3.  **Simplicity:** The logic is consistent. To center something, you don't touch the thing itself; you tell its parent `<td>` to center it. This makes debugging much easier.