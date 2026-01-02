---
title: Ways to map the Windows keyboard
description: Ways to map the Windows keyboard
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - utilities
---
I use two keyboard mapping programs:

> Update: [This is the only thing that worked](https://learn.microsoft.com/en-us/sysinternals/downloads/ctrl2cap) reliably to remap the caps lock key!

#### [Espanso](https://espanso.org/)

I use this for fast keystroke macros.

#### [AutoHotKey](https://www.autohotkey.com/)

This program reliably maps the `caplock` and `numlock` keys. It may have a way to create auto-triggered two-character hot keys (ie, type `fc` and have the `fc` replaced with an underscore) but I haven't found it yet.

Espanso config

```
C:\Users\thumb\AppData\Roaming\espanso\match\base.yml
```

```
| Trigger   | Replace                       |
| --------- | ----------------------------- | ---------- |
| rpmail    | `roger.pence@gmail.com`       |
| :smalltag | `<small>$                     | $</small>` |
| si        | `$\{\}`                       |
| dprop     | Declare a CSS custom property |
| uprop     | Use a CSS custom property     |
| jc        | `_`                           |
| jd        | `-`                           |
| jk        | `@`                           |
| jt        | `ticks`                       |
| jb        | `[]`                          |
| jp        | `()`                          |
| jm        | `{}`                          |
| :envon    | `env\\scripts\\activate\n`    |
| ansa      | `asna`                        |
| mdlink    | `markdown link`               |
| mdimg     | `markdown image`              |
| nbsp      | `&nbsp;`                      |
| mdash     | `&mdash;`                     |
| ibmii     | `IBM&nbsp;`                   |
```

espanso match file

For a complete introduction, visit the official docs at: https://espanso.org/docs/

You can use this file to define the base matches (aka snippets)
that will be available in every application when using espanso.

Matches are substitution rules: when you type the "trigger" string
it gets replaced by the "replace" string.
matches:
Simple text replacement
trigger: ":espanso"
replace: "Hi there!"


```

-   trigger: "rpmail"
    replace: "roger.pence@gmail.com"

-   trigger: ":smalltag"
    replace: "<small>$|$</small>"

-   trigger: "jc"
    replace: "\_"

-   trigger: "jd"
    replace: "-"

-   trigger: "jk"
    replace: "@"

-   trigger: "jt"
    replace: "`$|$`"

-   trigger: "jb"
    replace: "[$|$]"

-   trigger: "jp"
    replace: "($|$)"

-   trigger: "jm"
    replace: `"{$|$}"`

-   trigger: ":envon"
    replace: "env\\scripts\\activate\n"

-   trigger: "ansa"
    replace: "asna"
    word: true

-   trigger: "teh"
    replace: "the"
    word: true
-   trigger: "mdlink"
    replace: "[$|$]() "
-   trigger: "mdimg"
    replace: "![]($|$) "
-   trigger: "nbsp"
    replace: "&nbsp;"

-   trigger: "mdash"
    replace: "&mdash;"
-   trigger: "ibmii"  
    replace: "IBM&nbsp;i "
```

AutoHotKey config

```
C:\\Users\\thumb\\Documents\\AutoHotkey\\remap-keys.ahk
```

```
CapsLock::LCtrl
NumLock::Backspace
```

