---
title: tailwind-example-menu-with-dropdowns
description: tailwind-example-menu-with-dropdowns
date_created: '2025-09-29T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - tailwind
---
This documentation explains what each unique Tailwind CSS class block is doing in your navigation menu.


See route `menu-tw-41` in the Svelte `tailwind-4-2` project.

## Main Navigation Container
```html
class="flex list-none m-0 p-0 bg-slate-700 h-15 shadow-md relative z-[1000]"
```
- `flex` - Sets display to flexbox for horizontal layout
- `list-none` - Removes default list bullets/numbering
- `m-0` - Sets margin to 0 on all sides
- `p-0` - Sets padding to 0 on all sides
- `bg-slate-700` - Sets background color to dark gray-blue
- `h-15` - Sets height to 3.75rem (60px)
- `shadow-md` - Adds medium drop shadow
- `relative` - Sets position relative for z-index context
- `z-[1000]` - Sets z-index to 1000 (high stacking order)

## Top-Level Menu Items (Dropdown Parents)
```html
class="relative group"
```
- `relative` - Creates positioning context for absolutely positioned dropdowns
- `group` - Establishes hover group for child elements to respond to parent hover

## Main Navigation Links
```html
class="flex items-center h-full px-6 text-white no-underline font-medium cursor-pointer transition-colors duration-200 hover:bg-slate-600"
```
- `flex` - Sets display to flexbox
- `items-center` - Vertically centers flex items
- `h-full` - Sets height to 100% of parent
- `px-6` - Sets horizontal padding to 1.5rem
- `text-white` - Sets text color to white
- `no-underline` - Removes text decoration
- `font-medium` - Sets font weight to 500 (medium)
- `cursor-pointer` - Changes cursor to pointer on hover
- `transition-colors` - Animates color changes
- `duration-200` - Sets transition duration to 200ms
- `hover:bg-slate-600` - Changes background to lighter slate on hover

## Dropdown Arrow Icons
```html
class="h-4 ml-2 fill-white transition-transform duration-200 group-hover:rotate-180"
```
- `h-4` - Sets height to 1rem
- `ml-2` - Sets left margin to 0.5rem
- `fill-white` - Sets SVG fill color to white
- `transition-transform` - Animates transform changes
- `duration-200` - Sets transition duration to 200ms
- `group-hover:rotate-180` - Rotates 180° when parent group is hovered

## Dropdown Menu Container
```html
class="absolute top-full left-0 min-w-[280px] list-none p-0 m-0 bg-white rounded-b-lg shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-gray-200 border-t-0 opacity-0 invisible translate-y-2.5 transition-all duration-250 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
```
- `absolute` - Positions absolutely relative to parent
- `top-full` - Positions at 100% from top (below parent)
- `left-0` - Aligns to left edge of parent
- `min-w-[280px]` - Sets minimum width to 280px
- `list-none` - Removes list styling
- `p-0 m-0` - Removes padding and margin
- `bg-white` - Sets white background
- `rounded-b-lg` - Rounds bottom corners (large radius)
- `shadow-[0_8px_24px_rgba(0,0,0,0.15)]` - Custom shadow (x=0, y=8px, blur=24px, opacity=0.15)
- `border border-gray-200` - Adds light gray border
- `border-t-0` - Removes top border
- `opacity-0` - Initially transparent
- `invisible` - Initially hidden from screen readers
- `translate-y-2.5` - Initially moved down 10px
- `transition-all duration-250` - Animates all properties over 250ms
- `group-hover:opacity-100` - Becomes opaque on parent hover
- `group-hover:visible` - Becomes visible on parent hover
- `group-hover:translate-y-0` - Returns to normal position on parent hover

## Dropdown Spacer
```html
class="h-2"
```
- `h-2` - Sets height to 0.5rem (8px spacing gap)

## Dropdown Content Wrapper
```html
class="py-2"
```
- `py-2` - Sets vertical padding to 0.5rem (top and bottom)

## Dropdown Links (Standard)
```html
class="block px-6 py-3 text-gray-800 no-underline whitespace-nowrap transition-colors duration-200 hover:bg-red-500 hover:text-black"
```
- `block` - Sets display to block (full width)
- `px-6` - Sets horizontal padding to 1.5rem
- `py-3` - Sets vertical padding to 0.75rem
- `text-gray-800` - Sets dark gray text color
- `no-underline` - Removes link underlines
- `whitespace-nowrap` - Prevents text wrapping
- `transition-colors duration-200` - Animates color changes over 200ms
- `hover:bg-red-500` - Red background on hover
- `hover:text-black` - Black text on hover

## Dropdown Links (Indented)
```html
class="block px-6 py-3 pl-10 text-gray-800 no-underline whitespace-nowrap transition-colors duration-200 hover:bg-red-500 hover:text-black"
```
- Same as standard dropdown links, plus:
- `pl-10` - Sets left padding to 2.5rem (creates indentation)

## Dropdown Subtext
```html
class="text-sm text-gray-600 mt-1 font-normal"
```
- `text-sm` - Sets font size to 0.875rem (14px)
- `text-gray-600` - Sets medium gray text color
- `mt-1` - Sets top margin to 0.25rem
- `font-normal` - Sets font weight to 400 (normal)

## Button Element (Contact Tech Support)
```html
class="block px-6 py-3 text-gray-800 no-underline whitespace-nowrap transition-colors duration-200 hover:bg-red-500 hover:text-black bg-transparent border-none w-full text-left cursor-pointer text-base font-inherit"
```
- Same as dropdown links, plus:
- `bg-transparent` - Transparent background
- `border-none` - Removes button borders
- `w-full` - Sets width to 100%
- `text-left` - Left-aligns text
- `cursor-pointer` - Pointer cursor
- `text-base` - Base font size (1rem)
- `font-inherit` - Inherits font family from parent

## Separator List Items
```html
class="m-0 p-0"
```
- `m-0` - Removes all margins
- `p-0` - Removes all padding

## Horizontal Rule Separators
```html
class="border-0 h-px bg-gray-200 my-2"
```
- `border-0` - Removes default border
- `h-px` - Sets height to 1px
- `bg-gray-200` - Light gray background color
- `my-2` - Sets vertical margin to 0.5rem (top and bottom)

## External Link Icons
```html
class="fa-regular fa-arrow-up-right-from-square ml-2 text-sm opacity-70"
```
- `fa-regular fa-arrow-up-right-from-square` - Font Awesome icon classes
- `ml-2` - Sets left margin to 0.5rem
- `text-sm` - Small text size
- `opacity-70` - 70% opacity (semi-transparent)