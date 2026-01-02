---
title: Kinisis keyboard configuration
description: Kinisis keyboard configuration
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - utilities
---
https://gaming.kinesis-ergo.com/wp-content/uploads/2019/04/Freestyle-Edge-RGB-Quick-Start-Guide-v2.12.19.pdf

![[image-30.png|800]]

To map the Kinesis drive, press `SmartSet` key and `F8`

This toggles the Kinesis drive.

![[Kinesis keyboard notes.png|350]]

| Description          | Keystroke                         | **Notes**                          |
| -------------------- | --------------------------------- | ---------------------------------- |
| Toggle keyboard lock | SmartSet + Shift + L              |                                    |
| Toggle v-drive       | SmartSet + F8                     |                                    |
| Hard Reset           | SmartSet + F12 + plug keyboard in | Be sure to copy layout1.txt first! |
| Load Profile 1 - 3   | Profile key                       | Profile key rotates 1 - 3          |
If the Program Lock is enabled, the indicator LEDs flash 4 times. When you disable Program Lock, the indicator LEDs flashes twice.

The "Layout" key is also called the "Profile key"

Pressing "SmartKey" key and the "Layout/Profile" key to reload the keyboard configuration.

The Kinesis Keyboard PDF is at:
https://drive.google.com/file/d/1sfS09DCbGbQAg5EmxzOrjvCxX2njaw9d/view?usp=drive_link

My current keyboard configuration is available on the "seagate-4tb-desktop" drive at:

```
E:\backup\kinesis-keyboard
```

My layout is in

```
x:\layouts\layout1.txt
```

where `x:` is the Kinesis virtual drive (toggled with Kinesis SmartSet Key and F8). Press the `{Profile}` key until the left light is on to load the #1 layout.

layout1.txt contents as of 2024-10-08:

```
|               |            |
| ------------- | ---------- |
| Function keys |            |
| h             | ``         |
| j             | []         |
| k             | {}         |
| l             | ()         |
| y             | $          |
| :             | -          |
| '             | \_         |
| 7             | {home}     |
| 8             | {end}      |
|               |            |
| Kinesis keys  |            |
| 1             | copy       |
| 2             | paste      |
| 3             | ctrl/E     |
| 4             | upaste     |
| 5             | code fence |

Powderfinger = 2025-05-10
```

```
[caps]>[fnshf]
fn [caps]>[fnshf]
```
 
```
* Pairs  
* j = {}
* k = []
* l = ()
* h = ``
* Singles 
* u = +
* y = $
* i = * 
* : = dash
* ' = underscore
* p = equal

fn {7}>{x1}{s3}{home}
fn {8}>{x1}{s3}{end}

fn {h}>{s5}{x1}{tilde}{tilde}{lft}
fn {j}>{x1}{s3}{-lshft}{obrk}{+lshft}{-lshft}{cbrk}{+lshft}{lft}
fn {k}>{x1}{s3}{obrk}{cbrk}{lft}
fn {l}>{x1}{s3}{-lshft}{9}{+lshft}{-lshft}{0}{+lshft}{lft}
fn [colon]>-
fn {apos}>{x1}{s6}{-lshft}{hyph}{+lshft}

fn {y}>{x1}{s3}{-lshft}{4}{+lshft}
fn {u}>{x1}{s3}{-lshft}{=}{+lshft}
fn {i}>{x1}{s3}{-lshft}{8}{+lshft}
fn {o}>{x1}{s3}{-lctrl}{s}{+lctrl}
fn {p}>{x1}{s3}{=}

fn {bspc}>{s9}{x1}{-lshft}f{+lshft}u{-lshft}Z{+lshft}{-lshft}Z{+lshft}y{-lshft}N{+lshft}u{d020}u{-lshft}S{+lshft}o{d020}o{-lshft}1{+lshft}{-lshft}4{+lshft}1{d020}7{d020}3{d020}1{d020}{ent}


fn {m}>{x1}{s3}{-lctrl}{a}{+lctrl}
fn [n]>[lwin]

* Kinesis keys

* Escape 
[hk0]>[esc]

* Copy 
{hk1}>{x1}{-lctrl}{c}{+lctrl}

* Paste
{hk2}>{x1}{-lctrl}{v}{+lctrl}

* Ctrl/E (toggle entry mode in Obsidian
{hk3}>{x1}{-lctrl}{e}{+lctrl}

* Unformated paste
{hk4}>{x1}{s6}{x1}{-lctrl}{-lshft}{v}{+lshft}{+lctrl}

* Code fences - ready for input
* h5 = Obsidian
* h6 = other
{hk5}>{s3}{x1}{tilde}{tilde}{tilde}{ent}
{hk6}>{s6}{x1}{tilde}{tilde}{tilde}{ent}{d125}{tilde}{tilde}{tilde}{home}{ent}{up}
```

Keystrokes mapped

![[Kinesis keyboard notes-2.png|1200]]

[Kinesis keyboard programming doc](https://gaming.kinesis-ergo.com/wp-content/uploads/2023/05/Freestyle-Edge-Direct-Programming-Guide-Expansion-Pack-2-May-24-2023.pdf)


```
| Command                                  | Description                       |
| ---------------------------------------- | --------------------------------- |
| [caps]>[fnshf]                           | Caps key = Kinesis Fn key         |
| fn [caps]>[fnshf]                        | Thiş probably shouldn't be here!  |
| fn [i]>[up]                              | Fn + i = up                       |
| fn [h]>[home]                            | Fn + h = home                     |
| fn [j]>[lft]                             | Fn + j = left                     |
| fn [k]>[dwn]                             | Fn + k = down                     |
| fn [l]>[rght]                            | Fn + l = right                    |
| fn [n]>[lwin]                            | Fn + n = left Windows key         |
| fn [colon]>-                             | Fn + ; = - (dash)                 |
| fn {apos}>{x1}{s6}{-lshft}{hyph}{+lshft} | Fn + ' = \_ (underscore)          |
| [hk0]>[esc]                              | H0 (Top-left key) = Escape        |
| {hk1}>{x1}{-lctrl}{c}{+lctrl}            | H1 = copy                         |
| {hk2}>{x1}{-lctrl}{v}{+lctrl}            | H2 = paste                        |
| {hk3}>{x1}{-lctrl}{e}{+lctrl}            | H3 = Ctrl/E (mostly for Obsidian) |
| {hk4}>{x1}                               | H4 = unformatted paste            |
| fn {bspc}*(see below)                    | Fn + backspace = password         |
```

Enter password and press enter.

```
fn {bspc}>{s9}{x1}{-lshft}f{+lshft}u{-lshft}Z{+lshft}{-lshft}Z{+lshft}y{-lshft}N{+lshft}u{d020}u{-lshft}S{+lshft}o{d020}o{-lshft}1{+lshft}{-lshft}4{+lshft}1{d020}7{d020}3{d020}1{d020}{ent}
```

This reassignment is especially interesting

```
fn {apos}>{x1}{s6}{-lshft}{hyph}{+lshft}
```

It translates to:

```
| Token       | Description                          |
| ----------- | ------------------------------------ |
| fn {apos} > | Assign the {apos} key                |
| {x1}        | {x1} limit playback to one time      |
| {s6}        | {s6} speed                           |
| {-lshft}    | Left shift key down                  |
| {hyph}      | Type shifted {hyph} key (underscore) |
| {+lshft}    | Left shift key up                    |
```

```
fn {apos}>{x1}{s6}{-lshft}{hyph}{+lshft}
{hk1}>{x1}{-lctrl}{c}{+lctrl}
{hk2}>{x1}{-lctrl}{v}{+lctrl}
{hk3}>{x1}{s6}{x1}{-lctrl}{-lshft}{v}{+lctrl}{+lshft}
```

The `{s6}` speed value can vary, but for what I do six is a good value for the speed. The programming doc referenced above goes into some detail on the tokens used here.

## Clearing an accidentally remapped key.

The other day I had this issue with my Kinesis keyboard:

> My Kinesis keyboard has worked like a champ since I bought it. Today, all of sudden, the F10 key started doing weird things. Pressing it causes whatever is on the clipboard to spray across the screen. I first noticed this pressing F10 while debugging code in Visual Studio. After ending VS, the keyboard was permanently in Caps Lock mode and several keys (arrow keys and other nav keys) wouldn't respond. To clear things up I had to reboot the computer. I can repeat this issue. I tested pressing F10 with Teams, Notepad, and VS Code and F10 goes nuts there, too. I did confirm that the PC works fine with other keyboards--no issue with F10 there. I can make a video of this if that would help. thank you.

Tech support replied:

It seems like you programmed a macro or two on accident. Let’s reset the key to make sure you didn’t program anything to it by accident.


Remap it back to itself (Unmap a key):

```
1. Tap {Remap}
2. Tap {F10} twice.
3. Done! Test.
```
Erase any macro:

```
1. Tap {Macro}
2. Tap {F10}
3. Tap {Macro}
4. Done! Test.
```

> Note: I tried the soft reset below. It worked, but it zapped my config file! I had to restore it from my backup (see above). I probably should have done the steps above.

Or, try a soft reset. A soft reset will erase the active profile to its default state and remove all programming. [SmartSet+Shift+F12] will soft reset the active profile.

```
1. Hold {SmartSet}
2. Hold {Shift}
3. Tap {12}
4. Release all keys.
5. Indicator LEDs, and the LED above the SmartSet key will flash four times to indicate the profile has been reset.
```
