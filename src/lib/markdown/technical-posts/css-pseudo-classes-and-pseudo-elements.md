---
title: CSS Pseudo classes
description: CSS Pseudo classes
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
### Pseudo Classes

-   Always start with a single colon
-   Always reflect state (ie, `:hover` or `:focus`)
-   Always selects an entire element
-   I think CSS nesting does support pseudo classes

Each cell in this list is populated with the pseudo-classes from the provided list, organized in four columns.

| Selector             | Example               | Example Description                                                                                  |
| -------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| :active              | a:active              | Selects the active link                                                                              |
| :checked             | input:checked         | Selects every checked `input` element                                                                |
| :disabled            | input:disabled        | Selects every disabled `input` element                                                               |
| :empty               | p:empty               | Selects every `p` element that has no children                                                       |
| :enabled             | input:enabled         | Selects every enabled `input` element                                                                |
| :first-child         | p:first-child         | Selects every `p` elements that are the first child of its parent                                    |
| :first-of-type       | p:first-of-type       | Selects every `p` element that is the first `p` element of its parent                                |
| :focus               | input:focus           | Selects the `input` element that has focus                                                           |
| :hover               | a:hover               | Selects links on mouse over                                                                          |
| :in-range            | input:in-range        | Selects `input` elements with a value within a specified range                                       |
| :invalid             | input:invalid         | Selects all `input` elements with an invalid value                                                   |
| :lang(language)      | p:lang(it)            | Selects every `p` element with a lang attribute value starting with "it"                             |
| :last-child          | p:last-child          | Selects every `p` elements that are the last child of its parent                                     |
| :last-of-type        | p:last-of-type        | Selects every `p` element that is the last `p` element of its parent                                 |
| :link                | a:link                | Selects all unvisited links                                                                          |
| :not(selector)       | :not(p)               | Selects every element that is not a `p` element                                                      |
| :nth-child(n)        | p:nth-child(2)        | Selects every `p` element that is the second child of its parent                                     |
| :nth-last-child(n)   | p:nth-last-child(2)   | Selects every `p` element that is the second child of its parent, counting from the last child       |
| :nth-last-of-type(n) | p:nth-last-of-type(2) | Selects every `p` element that is the second `p` element of its parent, counting from the last child |
| :nth-of-type(n)      | p:nth-of-type(2)      | Selects every `p` element that is the second `p` element of its parent                               |
| :only-of-type        | p:only-of-type        | Selects every `p` element that is the only `p` element of its parent                                 |
| :only-child          | p:only-child          | Selects every `p` element that is the only child of its parent                                       |
| :optional            | input:optional        | Selects `input` elements with no "required" attribute                                                |
| :out-of-range        | input:out-of-range    | Selects `input` elements with a value outside a specified range                                      |
| :read-only           | input:read-only       | Selects `input` elements with a "readonly" attribute specified                                       |
| :read-write          | input:read-write      | Selects `input` elements with no "readonly" attribute                                                |
| :required            | input:required        | Selects `input` elements with a "required" attribute specified                                       |
| :root                | root                  | Selects the document's root element                                                                  |
| :target              | `#news`:target        | Selects the current active `#news` element (clicked on a URL containing that anchor name)            |
| :valid               | input:valid           | Selects all `input` elements with a valid value                                                      |
| :visited             | a:visited             | Selects all visited links                                                                            |

### Pseudo Elements

-   Always start with a double colon
    -   For backwards compatibility, browsers do allow these pseudo elements `::before`, `::after`, `::first-line`, and `::first-letter` to use a single colon--that isn't a good practice.
-   Always selects a part of an element (ie, `::before` or `::first-letter`)
-   CSS nesting does not support pseudo elements

Pseudo elements are:

Here's a Markdown table of CSS pseudo-elements and their meanings:

| Pseudo-Element                 | Meaning                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `:active`                      | Represents an element being activated                                                   |
| `::after/:after`               | Represents content inserted after an element                                            |
| `::backdrop (experimental)`    | Represents a backdrop layer (experimental)                                              |
| `::before/:before`             | Represents content inserted before an element                                           |
| `:checked`                     | Represents a checked input element                                                      |
| `:default`                     | Represents a default input element                                                      |
| `:dir (experimental)`          | Represents the direction of text (experimental)                                         |
| `:disabled`                    | Represents a disabled input element                                                     |
| `:empty`                       | Represents an empty element                                                             |
| `:enabled`                     | Represents an enabled input element                                                     |
| `:first-child`                 | Represents the first child of its parent                                                |
| `::first-letter/:first-letter` | Represents the first letter of an element                                               |
| `::first-line/:first-line`     | Represents the first line of an element                                                 |
| `:first-of-type`               | Represents the first element of its type                                                |
| `:focus`                       | Represents an element with focus                                                        |
| `:fullscreen (experimental)`   | Represents a fullscreen element (experimental)                                          |
| `:hover`                       | Represents an element being hovered over                                                |
| `:in-range`                    | Represents an input element with a value within a specified range                       |
| `:indeterminate`               | Represents an input element in an indeterminate state                                   |
| `:invalid`                     | Represents an input element with an invalid value                                       |
| `:lang`                        | Represents an element with a specific language attribute                                |
| `:last-child`                  | Represents the last child of its parent                                                 |
| `:last-of-type`                | Represents the last element of its type                                                 |
| `:link`                        | Represents an unvisited link                                                            |
| `:not`                         | Represents an element that does not match a selector                                    |
| `:nth-child`                   | Represents an element that is the nth child of its parent                               |
| `:nth-last-child`              | Represents an element that is the nth child of its parent, counting from the last child |
| `:nth-last-of-type`            | Represents an element that is the nth element of its type, counting from the last child |
| `:nth-of-type`                 | Represents an element that is the nth element of its type                               |
| `:only-child`                  | Represents an element that is the only child of its parent                              |
| `:only-of-type`                | Represents an element that is the only element of its type                              |
| `:optional`                    | Represents an input element with no "required" attribute                                |
| `:out-of-range`                | Represents an input element with a value outside a specified range                      |
| `::placeholder (experimental)` | Represents placeholder text in an input element (experimental)                          |
| `:read-only`                   | Represents an input element with a "readonly" attribute specified                       |
| `:read-write`                  | Represents an input element with no "readonly" attribute                                |
| `:required`                    | Represents an input element with a "required" attribute specified                       |
| `:root`                        | Represents the document's root element                                                  |
| `::selection`                  | Represents the portion of an element selected by the user                               |
| `:scope (experimental)`        | Represents the scope of a style (experimental)                                          |
| `:target`                      | Represents an element targeted by a URL fragment identifier                             |
| `:valid`                       | Represents an input element with a valid value                                          |
| `:visited`                     | Represents a visited link                                                               |

You can copy and paste this Markdown table into your document.

### Examples

```
a[href*='https']::after {
   font-family: "Font Awesome 5 Free";
   font-weight: 800;
   content: "\f08e";
   margin-left: .25rem;
}
```