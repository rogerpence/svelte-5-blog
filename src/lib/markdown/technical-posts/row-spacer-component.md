---
title: RowSpacer email component
description: RowSpacer email component
date_created: '2025-07-23T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - email-builder-v8
---
## Overview

The `RowSpacer` component creates vertical spacing in HTML emails, specifically designed for cross-client compatibility with Microsoft Outlook. It renders a table row with precise height control that works consistently across different email clients.

## File Location
```
src/lib/components/experimental/RowSpacer.svelte
```

## Purpose

- **Primary**: Add precise vertical spacing between email content sections
- **Cross-client compatibility**: Handles Outlook's unique rendering quirks
- **Flexible**: Supports custom heights and background colors

## Props Interface

```typescript
interface Props {
    eData: DynamicObject;          // Email data object (required)
    height?: number | string;       // Spacer height in pixels (default: 20)
    backgroundColor?: string;       // Background color (optional)
}
```

### Prop Details

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `eData` | `DynamicObject` | *required* | Global email data object containing theme settings |
| `height` | `number \| string` | `20` | Height of the spacer in pixels |
| `backgroundColor` | `string` | `eData.global.emailBackgroundColor` | Background color for the spacer |

## Usage Examples

### Basic Usage
```svelte
<RowSpacer {eData} height="30" />
```

### With Custom Background
```svelte
<RowSpacer {eData} height="50" backgroundColor="#f5f5f5" />
```

### Numeric Height
```svelte
<RowSpacer {eData} height={25} />
```

### Minimal Spacing
```svelte
<RowSpacer {eData} height="5" />
```

## Technical Implementation

### Outlook Compatibility Strategy

The component uses a **dual-rendering approach** to handle Outlook's unique CSS processing:

1. **MSO Conditional**: `<!--[if mso]>` - Processed by Outlook with full CSS trust
2. **Non-MSO Conditional**: `<!--[if !mso]>` - Processed by other email clients
3. **Fallback**: Plain HTML for maximum compatibility

### Rendered HTML Structure

```html
<table align="center" bgcolor="{backgroundColor}" role="presentation" 
       style="width:600px;border-collapse:collapse;border:0;border-spacing:0;text-align:center;">
    <tbody>
        <tr data-component="rowSpacer">
            <!--[if mso]>
            <td style="height:{height}px; line-height:{height}px; font-size:1px;">...</td>
            <![endif]-->
            
            <!--[if !mso]><!-->
            <td style="height:{height}px; line-height:{height}px; font-size:1px;">...</td>
            <!--<![endif]-->
            
            <td style="height:{height}px; line-height:{height}px; font-size:1px;">...</td>            
        </tr>
    </tbody>
</table>
```


## Nutty stuff going on! 

The code above would seem to render two rows;  the `mso` or the `non-mso` row, and then the final plain HTML row. However, that isn't what happens. Only one of the three rows is rendered. 

The old Outlook ( `mso`) and pure HTML in a browser (`non-mso`) render the respective markup and ignore the plain HTML row. 

For Web clients, Gmail and Web Outlook ignore the plain HTML version and renders a slightly mangled version of the `non-mso` content. However, new Outlook renders ignores the `mso` and `non-mso` rows and correctly renders the third plain HTML row. 

This means that you cannot get a high-fidelity rendering on _all_ clients. You need target those clients that you think the majority of your readers are most using. It's also important to provide a "read online" option where the HTML does render well as an HTML document in browsers (and since browsers are seen as `non-mso` that's easy to. Alas, Web browser clients are not seen as either and therein lives the rub!


### Key CSS Properties

- **`height`**: Sets exact pixel height
- **`line-height`**: Matches height for consistent spacing
- **`font-size: 1px`**: Minimizes text impact on spacing
- **`mso-line-height-rule: exactly`**: Forces Outlook to respect exact measurements
- **`mso-line-height-alt`**: Outlook-specific line height override

## Best Practices

### Recommended Heights
- **Small gaps**: 5-15px
- **Section spacing**: 20-40px  
- **Major breaks**: 50-80px

### Usage Patterns
```svelte
<!-- Between content sections -->
<ContentSection />
<RowSpacer {eData} height="30" />
<ContentSection />

<!-- Before/after major elements -->
<RowSpacer {eData} height="20" />
<Header />
<RowSpacer {eData} height="40" />
<MainContent />
```

## Browser/Client Support

| Client | Support | Notes |
|--------|---------|-------|
| Outlook 2016+ | ✅ | Primary target - uses MSO conditionals |
| Gmail | ✅ | Uses standard HTML/CSS |
| Apple Mail | ✅ | Uses standard HTML/CSS |
| Thunderbird | ✅ | Uses standard HTML/CSS |
| Outlook.com | ✅ | Modern web-based rendering |

## Dependencies

- **MsoTable**: Parent table wrapper component
- **helpers**: Utility functions (not directly used but imported)

## Troubleshooting

### Common Issues

1. **Inconsistent spacing in Outlook**
   - Ensure both MSO and non-MSO conditionals are present
   - Don't remove the "duplicate" TD elements

2. **Minimum height enforced**
   - Outlook may enforce 8-12px minimum regardless of settings
   - Use `font-size: 0px` for smaller spacing if needed

3. **Background color not showing**
   - Check `eData.global.emailBackgroundColor` is properly set
   - Verify background color format (hex, rgb, named colors)

### Debug Tips
```svelte
<!-- Add data attributes for debugging -->
<tr data-component="rowSpacer" data-height="{height}">
```

## Performance Notes

- Lightweight component with minimal DOM impact
- Template string generation happens once per component instance
- No reactive dependencies beyond initial prop evaluation