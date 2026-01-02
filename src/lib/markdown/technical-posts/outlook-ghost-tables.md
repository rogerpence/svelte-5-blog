---
title: Outlook ghost tables and other MSO related things
description: Outlook ghost tables and other MSO related things
date_created: 2025-06-29T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - outlook
  - email
---
Here are the major gotchas with Outlook MSO ghost tables that can trip you up:
## 1. **Width Calculation Issues**
- Ghost table width must account for parent padding/margins
- Always calculate: `ghostWidth = parentWidth - leftPadding - rightPadding`
- Use integer values: `width="536"` not `width="536px"`

## 2. **Nested Table Problems**
````html
<!-- BAD: Nested ghost tables can break -->
<!--[if mso | IE]>
<table width="600">
  <tr><td>
    <!--[if mso | IE]>  <!-- Don't nest these! -->
    <table width="300">
````

## 3. **Font Size/Line Height Conflicts**
````html
<!-- Your outer td has font-size: 16px, but ghost table td has different values -->
<td style="font-size: 16px;">
  <!--[if mso | IE]>
  <td style="line-height:28px;font-size:16px;"> <!-- Must match or override -->
````

## 4. **Alignment Inheritance Issues**
````html
<!-- BAD: Conflicting alignment -->
<td align="left">
  <!--[if mso | IE]>
  <table align="center"> <!-- Outlook gets confused -->
````

## 5. **Background Color Bleeding**
````html
<!-- Ghost table can inherit unwanted background colors -->
<!--[if mso | IE]>
<table bgcolor="white"> <!-- Explicitly set to override inheritance -->
````

## 6. **Padding/Margin Double-Application**
````html
<!-- BAD: Padding gets applied twice -->
<td style="padding: 20px;">
  <!--[if mso | IE]>
  <td style="padding: 20px;"> <!-- Now you have 40px total padding! -->
````

## 7. **Missing `role="presentation"`**
````html
<!-- Always include this for accessibility -->
<!--[if mso | IE]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0">
````

## 8. **Incomplete MSO Table Structure**
````html
<!-- BAD: Missing tbody -->
<!--[if mso | IE]>
<table><tr><td>content</td></tr></table>

<!-- GOOD: Complete structure -->
<!--[if mso | IE]>
<table><tbody><tr><td>content</td></tr></tbody></table>
````

## 9. **Image Width Issues**
````html
<!-- Images in ghost tables need explicit width -->
<!--[if mso | IE]>
<table width="536">
<tr><td>
<![endif]-->
<img src="image.jpg" width="536" style="width: 536px; max-width: 536px;">
````

## 10. **Border Collapse Problems**
````html
<!-- Always reset table properties -->
<!--[if mso | IE]>
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
````

## 11. **Text Wrapping in Narrow Columns**
````html
<!-- For multi-column layouts, be very careful with width calculations -->
<!--[if mso | IE]>
<table width="536"><tr>
<td width="268" style="width: 268px;">Col 1</td>
<td width="268" style="width: 268px;">Col 2</td>
</tr></table>
<!-- 268 + 268 = 536, but what about borders/spacing? -->
````

## 12. **Your JSON Structure Gotcha**
Looking at your JSON, watch out for:
````json
{
  "calloutss": { // Typo: "calloutss" instead of "callouts"
    "spaceAfter": "0" // String instead of number
  }
}
````

## 13. **VML Objects Interference**
````html
<!-- VML can interfere with ghost tables -->
<!--[if mso]>
<v:rect> <!-- VML objects can break ghost table rendering -->
````

## Pro Tips:
1. **Test in actual Outlook**, not just browser dev tools
2. **Use Litmus or Email on Acid** for comprehensive testing
3. **Keep ghost tables simple** - avoid complex nesting
4. **Always specify explicit widths** on all td elements
5. **Use `mso-line-height-rule: exactly`** for consistent spacing

The key is remembering that Outlook's Word rendering engine is very different from web browsers, and ghost tables are essentially creating a parallel rendering path specifically for Outlook's quirks.

## VML

VML (Vector Markup Language) becomes a concern in email development specifically when dealing with **Outlook 2007-2016 on Windows** and certain **advanced email design elements**. Here's when you need to worry about it:

## 1. **Background Images in Outlook**
````html
<!-- VML is required for background images in Outlook 2007-2016 -->
<!--[if mso]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:400px;">
<v:fill type="tile" src="background-image.jpg" color="#cccccc" />
<v:textbox inset="0,0,0,0">
<![endif]-->
<div style="background-image: url('background-image.jpg'); width: 600px; height: 400px;">
  <p style="color: white;">Text over background</p>
</div>
<!--[if mso]>
</v:textbox>
</v:rect>
<![endif]-->
````

## 2. **Rounded Corners/Buttons**
````html
<!-- VML for rounded buttons in Outlook -->
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" 
             arcsize="10%" 
             stroke="f" 
             fillcolor="#0073e6" 
             style="height:40px;v-text-anchor:middle;width:200px;">
<v:textbox inset="0,0,0,0">
<![endif]-->
<a href="#" style="background-color:#0073e6; border-radius:4px; color:#ffffff; display:inline-block; padding:12px 24px; text-decoration:none;">
  Click Me
</a>
<!--[if mso]>
</v:textbox>
</v:roundrect>
<![endif]-->
````

## 3. **Your Email JSON Context - When You'd Need VML:**

Looking at your JSON structure, you'd need VML if you wanted to add:

### **Background Images Behind Text:**
````json
{
  "heroSection": {
    "backgroundImage": "https://nyc3.digitaloceanspaces.com/asna-assets/newsletter/summer.jpg",
    "text": "Summer is here...",
    "requiresVML": true
  }
}
````

### **Fancy Call-to-Action Buttons:**
````json
{
  "callouts": {
    "text": "ASNA support for Windows 10 ends on October 14th, 2025",
    "buttonStyle": "rounded", // This would need VML
    "imageUrl": "https://asna-assets.nyc3.digitaloceanspaces.com/newsletter/exclamation-point.png"
  }
}
````

## 4. **VML Gotchas with Ghost Tables:**

VML can interfere with your MSO ghost tables:

````html
<!-- BAD: VML and ghost tables can conflict -->
<!--[if mso | IE]>
<table width="536">
<tr><td>
<![endif]-->

<!--[if mso]>
<v:rect>  <!-- This can break the ghost table structure! -->
<![endif]-->

<div>Content</div>

<!--[if mso]>
</v:rect>
<![endif]-->

<!--[if mso | IE]>
</td></tr>
</table>
<![endif]-->
````

## 5. **When You DON'T Need VML (Your Current Case):**

Based on your JSON structure, you probably **don't need VML** because you're using:
- Simple text content
- Standard images (not backgrounds)
- Basic callouts with images
- Standard paragraph formatting

## 6. **VML Red Flags in Your Setup:**

You'd need to worry about VML if you decide to enhance your design with:
- **Hero sections with text over background images**
- **Rounded corner buttons/callouts** 
- **Complex shaped elements**
- **Gradient backgrounds**

## 7. **VML Namespace Declaration:**

If you do need VML, ensure your HTML includes:
````html
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
````

## **Bottom Line for Your Project:**

Your current email structure is **simple and VML-free**, which is actually **good news**! You're using:
- Text content ✅
- Standard images ✅  
- Basic tables ✅
- MSO ghost tables ✅

VML only becomes necessary when you want fancy visual effects that Outlook's Word rendering engine can't handle with standard HTML/CSS. For newsletters like yours, avoiding VML keeps things simpler and more reliable.

**Keep it simple = fewer headaches!** 🎯

## MSO exceptions

Outlook for Windows uses Microsoft Word's rendering engine (not a modern web browser engine like WebKit or Gecko), and it often ignores standard CSS. `mso-` properties are proprietary CSS extensions that speak directly to that Word engine.

Here is a comprehensive list of the most common and useful `mso-` related exceptions, categorized by their function.


### The Foundation: Conditional Comments

Before listing the properties, it's essential to know *how* to apply them. You almost always use them inside Outlook-specific conditional comments. This ensures that only Outlook reads these styles, while other email clients ignore them and use your standard CSS.

**The basic structure:**
```html
<!--[if mso]>
  <style>
    /* MSO-specific styles go here */
  </style>
<![endif]-->
```

### 1. Spacing, Padding, and Margins

This is the most common category of fixes.

#### `mso-padding-alt`
You already know this one. It's used to force padding on elements like `<table>`, `<td>`, and `<div>` where Outlook ignores the standard `padding` property.
```css
.my-box {
  padding: 20px; /* For modern clients */
  mso-padding-alt: 20px 20px 20px 20px; /* For Outlook */
}
```

#### `mso-margin-alt`
The direct counterpart to `mso-padding-alt`. It forces margins on elements that Outlook would otherwise collapse or ignore.
```css
.some-div {
  margin-bottom: 20px; /* For modern clients */
  mso-margin-bottom-alt: 20px; /* For Outlook */
}
```

#### `mso-line-height-rule: exactly;`
This is a critical one. Outlook sometimes adds extra space above or below text, especially when `line-height` is set to a relative value (like `1.5`) or a value smaller than the font size. This property forces Outlook to respect your `line-height` value precisely.
```css
.my-text {
  font-size: 16px;
  line-height: 20px;
  mso-line-height-rule: exactly; /* Forces Outlook to use 20px */
}
```

#### `mso-table-lspace` and `mso-table-rspace`
When you nest tables, Outlook can add unwanted space on the left (`lspace`) and right (`rspace`). Setting these to `0pt` removes that ghost spacing. This is a must-have for any aligned or nested table structures.
```html
<!--[if mso]>
<style>
  table {
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }
</style>
<![endif]-->
```

### 2. Borders and Colors

#### `mso-border-alt`
Similar to padding, this forces a border style on an element when the standard `border` property is being flaky. It's especially useful for buttons made from `<td>` elements.
```css
.button-cell {
  border: 1px solid #000000;
  mso-border-alt: 1px solid #000000; /* Outlook fallback */
}
```
#### `mso-color-alt`
Forces a color for elements, most commonly used to ensure border colors render correctly.
```css
.colored-border {
  border: 2px solid #5562a4;
  mso-border-alt: 2px solid #5562a4;
  mso-color-alt: #5562a4; /* Ensures border color is correct in Outlook */
}
```

### 3. Text and Font Control

#### `mso-font-alt`
Provides a fallback font for Outlook. If Outlook doesn't recognize or can't render your primary font (e.g., a web font), it will use the font specified here. It's a best practice to always include this when using custom fonts.
```css
.heading {
  font-family: 'Open Sans', Arial, sans-serif; /* For modern clients */
  mso-font-alt: 'Arial'; /* Fallback font for Outlook */
}
```

#### `mso-text-raise`
This property helps you control the vertical alignment of text. Outlook sometimes renders text slightly lower than other clients, especially with scaling issues (high DPI screens). You can use `mso-text-raise` with a negative value to pull the text up.
```css
.fix-alignment {
  mso-text-raise: -2px; /* Pulls text up by 2 pixels in Outlook */
}
```

### 4. Visibility and Layout

#### `mso-hide: all;`
This is extremely powerful. It completely hides an element from Outlook. It's the key to creating "Outlook-only" and "non-Outlook" content blocks.

**Example: The "Ghost Table"**
You might have a `<div>`-based layout for modern clients but need a `<table>`-based layout for Outlook.

```html
<!--[if mso]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
    <tr>
      <td>
        OUTLOOK-ONLY CONTENT
      </td>
    </tr>
  </table>
<![endif]-->

<!--[if !mso]><!-->
  <div style="mso-hide: all; display: block; max-width: 600px;">
    NON-OUTLOOK CONTENT
  </div>
<!--<![endif]-->
```
In this example, Outlook sees the table but not the div (because of `mso-hide: all`). All other clients see the div but not the table (because it's wrapped in a negative conditional comment).

### 5. Advanced & Less Common Properties

*   **`mso-ansi-font-size`, `mso-bidi-font-size`**: Force a specific font size in points (`pt`).
*   **`mso-element-frame-width`, `mso-element-frame-height`**: Can be used to try and force dimensions on wrapper elements.
*   **`mso-effects-shadow-color`**: Attempts to apply a text-shadow color.
*   **Vector Markup Language (VML)**: While not a simple `mso-` property, VML is Microsoft's old XML-based language for vector graphics. It's the "nuclear option" for creating effects that Outlook doesn't support with CSS, most famously for **background images on containers**. This is a more advanced technique but is rooted in the same "speaking to Microsoft's engine" principle.


### Summary and Best Practices

1.  **Code for Modern Clients First:** Write your standard, clean HTML and CSS.
2.  **Test in Outlook:** Identify where it breaks (spacing, fonts, buttons, etc.).
3.  **Layer on MSO Fixes:** Use conditional comments (`<!--[if mso]>`) to add a `<style>` block in the `<head>` or inline `mso-` properties to specifically target and fix the issues in Outlook.
4.  **Key Properties to Remember:**
    *   `mso-padding-alt` and `mso-margin-alt` for spacing.
    *   `mso-line-height-rule: exactly;` for text spacing.
    *   `mso-table-lspace: 0pt;` and `mso-table-rspace: 0pt;` for nested tables.
    *   `mso-hide: all;` for showing/hiding content.

By mastering these `mso-` properties, you gain precise control over how your emails render in one of the most challenging but widespread email clients.

## Outlook emails and CSS

Understanding how different versions of Outlook handle CSS classes is key to building reliable emails.

Here’s a breakdown by Outlook version:

### 1. Outlook for Windows (2007, 2010, 2013, 2016, 2019, 2021)

This is the version that causes the most trouble because it uses **Microsoft Word's rendering engine**.

*   **Yes, it supports CSS classes.** You can define a class in a `<style>` block in the `<head>` of your email and apply it with `class="my-class"`.
*   **BIG CAVEAT:** The *support for CSS properties* within those classes is very limited. The Word rendering engine ignores many modern CSS properties.

**What works with classes in Outlook for Windows:**
*   Basic font styling (`font-family`, `font-size`, `color`, `font-weight`).
*   Basic table styling (`border`, `background-color` on `<td>`s).
*   Link styling (`a:link`, `a:visited`).
*   `mso-` specific properties (this is a great use for classes!).

**What DOES NOT work well (or at all):**
*   `padding` and `margin` on `<div>`, `<p>`, `<a>` tags are often ignored or rendered inconsistently.
*   `width` and `height` on `<div>`s are unreliable.
*   Complex selectors (e.g., `div + p`) are not supported.
*   Most modern CSS like `flexbox`, `grid`, `border-radius`, `box-shadow`, and animations.

**Why are inline styles so common then?**
Because of these limitations, developers rely on inline styles (`style="..."`) for the most critical layout properties (`width`, `padding`, `background-color`, etc.) directly on `<table>` and `<td>` elements. This provides the highest level of cross-client compatibility and predictability, especially in Outlook for Windows.

### 2. Outlook.com (Webmail), Outlook for Mac, and Outlook Mobile Apps

These versions are much better because they use modern, web-standard rendering engines (like WebKit, which also powers Safari and Chrome).

*   **Yes, they have excellent support for CSS classes.**
*   You can confidently define your styles in a `<style>` block in the `<head>`, and they will be applied correctly.
*   They support a much wider range of CSS properties, including `padding`/`margin` on divs, `max-width` for responsive design, and even some CSS3 enhancements like `border-radius`.
*   This is where media queries (`@media`) work, allowing you to use classes to create a responsive layout for mobile.


### Best Practice: The Hybrid Approach

Because you have to code for the "worst-case scenario" (Outlook for Windows), the industry best practice is a **hybrid approach** that uses both CSS classes and inline styles.

**1. Use a `<style>` block in the `<head>` for:**
*   **Global Resets:** Basic styles for `body`, tables, and images.
*   **Link Styling:** Setting colors for `a:link`, `a:hover`, etc. (Gmail requires this in the head).
*   **Progressive Enhancements:** Styles that are "nice to have" but won't break the layout if Outlook ignores them (e.g., `border-radius`, `font-smoothing`).
*   **Outlook-Specific Fixes:** Using classes within `<!--[if mso]>` conditional comments to apply your `mso-` fixes.
*   **Responsive Styles:** Media queries for mobile clients.

**2. Use Inline Styles on HTML Tags (`<td>`, `<table>`, `<a>`) for:**
*   **Critical Layout Properties:** `width`, `height`, `background-color`, `padding`, `border`.
*   **Critical Font Styles:** `font-family`, `font-size`, `line-height`, `color`.

This "belt-and-suspenders" method ensures that the core structure and styling of your email hold up in every client, while allowing you to add more advanced styling for clients that can support it.

### Code Example of the Hybrid Approach

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF--8">
  <title>My Email</title>
  <!--[if mso]>
  <style>
    /* This class is ONLY for Outlook */
    .button-td-outlook {
      mso-padding-alt: 12px 25px 12px 25px; /* Force padding */
    }
  </style>
  <![endif]-->
  <style>
    .button-link {
      /* This styling is for modern clients */
      background-color: #0078D4;
      color: #ffffff;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px; /* Will be ignored by Outlook Desktop */
      display: inline-block;
    }
  </style>
</head>
<body style="margin: 0; padding: 0;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td>
        <!-- Button -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <!--
              HYBRID APPROACH IN ACTION:
              1. bgcolor (inline) for max compatibility.
              2. class (for mso fix) to add padding in Outlook.
            -->
            <td class="button-td-outlook" bgcolor="#0078D4" style="background-color: #0078D4;">
              <a href="https://example.com" target="_blank" class="button-link" style="font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; display: inline-block; padding: 12px 25px;">
                Click Here
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**In this example:**
*   **Modern Clients (Gmail, Apple Mail):** See a blue button with rounded corners because they read the `.button-link` class and the inline `padding`.
*   **Outlook for Windows:** Ignores `border-radius`. It also might ignore the `padding` on the `<a>` tag. However, it gets its padding from the `.button-td-outlook` class (thanks to `mso-padding-alt`) applied to the parent `<td>`. The `bgcolor` and inline font styles ensure the button looks correct.