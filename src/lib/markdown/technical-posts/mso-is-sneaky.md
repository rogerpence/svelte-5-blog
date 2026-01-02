---
title: MSO is sneaky
description: MSO is sneaky
date_created: '2025-07-22T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - mso
---
MSO is very sneaky. It hijacks your HTML and does lots of nefarious and mysterious things, including:
- CSS gets "helpfully" rewritten
- Font sizes have mysterious minimums  
- Table layouts work differently than literally everywhere else
- MSO conditionals have magical powers






rogerpence: The RowSpacer component renders a row in an HTML for emails intended for Windows Outlook.

I am calling it like this:
```
<RowSpacer {eData} height="14" />
```

to get a 14" high spacer in the email. 

The code present works just fine, emit one table for !mso and one for mso content.  I render the two TDs with this code:

```
<tr data-component="rowSpacer">
	{@html td}
	{@html msoTd}
</tr>
```

i noticed that in both cases the height, heightMso, padding, and paddingMso are exactly the same (14 and "0 0 14px 0", respectively)

Given that the markup is the same, I thougth I could remove this line
```            
{@html msoTd}
```            

but if do, Outlook does respect the spacing specified. If I include that line, it does. How can that be! The markup is the same in both cases?

GitHub Copilot: This is a classic Outlook rendering quirk! Even though the markup appears identical, there are subtle differences in how Outlook processes MSO conditional comments versus regular HTML. Here's what's happening:

## **Why both TDs are needed despite identical markup:**

### 1. **MSO Conditional Comment Processing**
Outlook's rendering engine processes MSO conditionals (`<!--[if mso]>`) at a **different stage** than regular HTML parsing. When Outlook sees:

```html
<!--[if !mso]><!-->
<td>content</td>
<!--<![endif]-->
<!--[if mso]>
<td>content</td>
<![endif]-->
```

It actually:
1. **Ignores** the `[if !mso]` block completely (doesn't even parse it)
2. **Processes** the `[if mso]` block as native HTML

### 2. **CSS Property Inheritance Differences**
Even with identical styles, Outlook treats MSO-conditional content differently:

- **Non-MSO TD**: Outlook tries to "fix" the CSS and may ignore certain properties
- **MSO TD**: Outlook trusts the CSS more because it's in an MSO block

### 3. **Font Size Minimum Enforcement**
Your `font-size: 1px` is being handled differently:
- **Non-MSO**: Outlook might enforce minimum font size (8-12px)
- **MSO**: Outlook respects the 1px because it's in an MSO conditional

## **Here's what's really different in processing:**

```svelte
const td = `
    <!--[if !mso]><!-->
    <td style="font-size: 1px; height:${height}px;">&#8203;</td>
    <!--<![endif]-->`;
    // ↑ Outlook ignores this completely

const msoTd = `       
    <!--[if mso]>
    <td style="font-size: 1px; height:${heightMso}px;">&#8203;</td>
    <![endif]-->`;
    // ↑ Outlook processes this as trusted MSO content
```

## **Solutions:**

### **Option 1: Simplify with proper MSO handling**
```svelte
<tr data-component="rowSpacer">
    <!--[if mso]>
    <td style="height:{heightMso}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
    <![endif]-->
    
    <!--[if !mso]><!-->
    <td style="height:{height}px;font-size:0px;line-height:{height}px;">&nbsp;</td>
    <!--<![endif]-->
</tr>
```

### **Option 2: Use different approaches per client**
```svelte
<tr data-component="rowSpacer">
    <!--[if mso]>
    <td height="{heightMso}" style="font-size:0;line-height:0;">&nbsp;</td>
    <![endif]-->
    
    <!--[if !mso]><!-->
    <td style="height:{height}px;font-size:0px;line-height:0px;">&#8203;</td>
    <!--<![endif]-->
</tr>
```

## **Why your current approach works:**

Your dual-TD approach works because:
1. **Non-Outlook clients** see only the first TD (due to MSO conditionals)
2. **Outlook** sees both TDs but the MSO-conditional one "wins" in the rendering priority
3. The MSO conditional signals to Outlook: "trust these styles completely"

**Bottom line:** Keep both TDs. The MSO conditional isn't just about different markup—it's about telling Outlook to process the styles with higher fidelity. Even identical markup behaves differently when wrapped in MSO conditionals versus not.

Email development, especially for Outlook, is absolutely **wild**. It's one of those areas where logic goes out the window and you end up with these bizarre workarounds that make no sense until you understand Outlook's quirky rendering engine.

The fact that identical markup behaves differently based on MSO conditional wrapping is just... *chef's kiss* 

You'll probably encounter more of these "wait, that makes no sense but it works" moments as you build out your email components. Outlook has so many rendering peculiarities:

- CSS gets "helpfully" rewritten
- Font sizes have mysterious minimums  
- Table layouts work differently than literally everywhere else
- MSO conditionals have magical powers

Keep that dual-TD pattern - it's going to save you a lot of headaches down the road!