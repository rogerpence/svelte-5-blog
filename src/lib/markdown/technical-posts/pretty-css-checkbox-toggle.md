---
title: A pretty CSS checkbox
description: A pretty CSS checkbox
date_created: '2025-08-07T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
See this CodePen
https://codepen.io/rogerpence/pen/QwjMGEK

Of course! This is a classic and very useful CSS technique that doesn't require any JavaScript.

The key is to use the **`:checked`** pseudo-class on the checkbox input, combined with a **sibling selector** (`+` or `~`) to target the `div`.

Here is the breakdown, from the simplest method to a more advanced, styled example.

### The Core Concept

1.  **`:checked` Pseudo-class:** This CSS selector applies styles to a checkbox (or radio button) *only when it is in the checked state*.
2.  **Adjacent Sibling Selector (`+`):** This selector targets an element that is the *very next sibling* in the HTML document.
3.  **General Sibling Selector (`~`):** This selector is more flexible. It targets *any sibling* that comes *after* the first element in the HTML.

For this to work, the `div` you want to style **must come after** the `<input>` tag in your HTML.


### Method 1: The Basic Implementation (Using `+`)

This is the simplest way. The `div` must be placed immediately after the checkbox.

#### HTML
```html
<!-- The checkbox needs an ID to be linked by the label -->
<input type="checkbox" id="bg-toggle">
<label for="bg-toggle">Toggle Background</label>

<!-- This is the div we will style. It's the IMMEDIATE next sibling. -->
<div class="my-box">
  <p>The background of this box will change.</p>
</div>
```

#### CSS
```css
/* 1. Default style for the div */
.my-box {
  background-color: #e0e0e0; /* Default light gray background */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
  /* Add a smooth transition for the color change */
  transition: background-color 0.4s ease;
}

/* 2. The magic rule: when the checkbox is checked... */
#bg-toggle:checked + .my-box {
  /* ...target the adjacent .my-box div and change its background */
  background-color: #a7d7c5; /* A nice mint green */
}
```
> **How it works:** When the checkbox with `id="bg-toggle"` is checked, the rule `#bg-toggle:checked + .my-box` becomes active and overrides the default background color. The `transition` property makes the color change smooth.


### Method 2: More Flexible (Using `~`)

What if your `label` is between the checkbox and the `div`? The `+` selector won't work anymore. This is where the general sibling selector (`~`) is perfect.

#### HTML
```html
<input type="checkbox" id="bg-toggle-2">

<!-- The label is now between the input and the div -->
<label for="bg-toggle-2">Toggle Background (Flexible)</label>

<div class="my-box-2">
  <p>This works even with other elements in between.</p>
</div>
```

#### CSS
```css
.my-box-2 {
  background-color: #f7f5dd; /* Default cream background */
  padding: 20px;
  border: 1px solid #ccc;
  transition: all 0.4s ease;
}

/* Use the general sibling selector (~) instead of (+) */
#bg-toggle-2:checked ~ .my-box-2 {
  background-color: #fca3b0; /* A nice salmon pink */
  color: white;
  border-color: #e48391;
}
```
> **How it works:** The `~` selector finds any `.my-box-2` that is a sibling of `#bg-toggle-2` and comes after it, regardless of what's in between.


### Full "Toggle Switch" Example

Let's combine these concepts to create a modern-looking toggle switch that controls the background, hiding the ugly default checkbox.

#### HTML
```html
<div class="toggle-container">
  <!-- The actual checkbox is hidden, but still functional -->
  <input type="checkbox" id="pretty-toggle" class="toggle-checkbox">

  <!-- The label is styled to look like a switch. Clicking it still checks the box. -->
  <label for="pretty-toggle" class="toggle-label"></label>

  <span>Turn on the lights!</span>
</div>

<!-- The div we are controlling -->
<div id="room">
  <p>The room is dark...</p>
</div>
```

#### CSS
```css
/* Hide the actual checkbox */
.toggle-checkbox {
  display: none;
}

/* Style the label to look like a switch */
.toggle-label {
  display: inline-block;
  width: 50px;
  height: 28px;
  background-color: #ccc;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;
}

/* Style the "nub" of the switch */
.toggle-label::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
}

/* Container for the toggle switch and text */
.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

/* --- The Toggling Logic --- */

/* When the checkbox is checked, move the nub on the label */
.toggle-checkbox:checked + .toggle-label {
  background-color: #4CAF50; /* Green */
}

.toggle-checkbox:checked + .toggle-label::after {
  transform: translateX(22px);
}

/* When the checkbox is checked, change the background of the div */
#room {
  background-color: #2c3e50; /* Dark blue "off" state */
  color: #7f8c8d;
  padding: 30px;
  text-align: center;
  font-size: 1.5em;
  border-radius: 8px;
  transition: all 0.5s ease-in-out;
}

/* Here's the magic for the div's background */
.toggle-checkbox:checked ~ #room {
  background-color: #f1c40f; /* Bright yellow "on" state */
  color: #333;
}

/* Also change the text inside the div */
.toggle-checkbox:checked ~ #room p::after {
  content: ' Now it\'s bright!';
}
```

### Key Takeaway

To toggle a `div`'s background with a checkbox using only CSS:
1.  Place the `div` **after** the `input[type="checkbox"]` in your HTML.
2.  Use the CSS selector `input:checked + div` (for immediate siblings) or `input:checked ~ div` (for any following sibling).
3.  Add a `transition` property to the `div` for a smooth visual effect.

## That first take didn't work! this one does.

You are absolutely right to point that out, and my apologies for the error in the third example. You've caught a fantastic and subtle but critical detail about how CSS selectors work. Thank you for the sharp eye!

Let me explain **why** method #2 might have failed for you and **why method #3 was definitely wrong as I wrote it**. Then I will provide the corrected code.

### The Crucial Rule: The Sibling Relationship

The `+` (adjacent sibling) and `~` (general sibling) selectors **only work on siblings**.

**Siblings** are elements that share the same immediate parent.

```html
<!-- CORRECT: input, label, and div are all siblings -->
<body> <!-- or any other parent div -->
  <input type="checkbox" id="toggle">
  <label for="toggle">Toggle</label>
  <div>This will work.</div>
</body>

<!-- WRONG: The div is NOT a sibling of the input -->
<body>
  <div class="container">
    <input type="checkbox" id="toggle"> <!-- The input's sibling is the label -->
  </div>
  <div>This will NOT work with a selector like #toggle:checked ~ div</div>
</body>
```

With that in mind, let's re-examine the methods.


### Method 1: Correct (As you confirmed)

This works because the `.my-box` div is the direct next sibling of the checkbox.

```css
#bg-toggle:checked + .my-box { ... }
```


### Method 2: Why It Might Have Failed For You

This method uses the general sibling selector (`~`), which is also correct. It should work perfectly as long as the sibling rule is followed.

#### HTML (Correct Structure)
```html
<input type="checkbox" id="bg-toggle-2">
<label for="bg-toggle-2">Toggle Background (Flexible)</label>
<div class="my-box-2">
  <p>This works even with other elements in between.</p>
</div>
```
#### CSS
```css
/* This selector targets ANY .my-box-2 that comes after the checked input */
#bg-toggle-2:checked ~ .my-box-2 {
  background-color: #fca3b0;
}
```

The most common reason this would fail is if you accidentally broke the sibling relationship, often by wrapping the input inside its label:

#### **Incorrect HTML Structure** (A Common Mistake)
```html
<!-- THIS WILL NOT WORK -->
<label for="bg-toggle-2">
  <input type="checkbox" id="bg-toggle-2"> <!-- Input is now a child of the label -->
  Toggle Background (Flexible)
</label>

<!-- This div is a sibling of the LABEL, not the INPUT -->
<div class="my-box-2">
  <p>My background won't change!</p>
</div>
```
In the "incorrect" example, the CSS selector `#bg-toggle-2:checked ~ .my-box-2` fails because the div is no longer a sibling of the input.


### Method 3: The Mistake in My Original Example (and the Fix)

This is where my original example was flawed. I wrapped the input and label in a `div`, breaking the sibling relationship with the target `div`.

#### My Incorrect HTML
```html
<!-- The input is inside this container -->
<div class="toggle-container">
  <input type="checkbox" id="pretty-toggle" class="toggle-checkbox">
  <label for="pretty-toggle" class="toggle-label"></label>
  <span>Turn on the lights!</span>
</div>

<!-- This div is a SIBLING OF THE CONTAINER, not the input -->
<div id="room">
  <p>The room is dark...</p>
</div>
```
My original CSS (`.toggle-checkbox:checked ~ #room`) could not work because the selector can't "escape" the `.toggle-container` to find its sibling.

### The Corrected, Modern Solution (using `:has()`)

The modern and most powerful way to fix this is with the `:has()` pseudo-class. It allows you to style a parent or a sibling based on a condition *inside* the parent.

**Browser support for `:has()` is now excellent across all modern browsers.**

#### HTML (The structure can stay the same and semantically clean)
```html
<div class="toggle-container">
  <input type="checkbox" id="pretty-toggle" class="toggle-checkbox">
  <label for="pretty-toggle" class="toggle-label"></label>
  <span>Turn on the lights!</span>
</div>

<div id="room">
  <p>The room is dark...</p>
</div>
```

#### Corrected CSS using `:has()`
```css
/* Style the room by default */
#room {
  background-color: #2c3e50; /* Dark */
  color: #7f8c8d;
  padding: 30px;
  border-radius: 8px;
  transition: all 0.5s ease-in-out;
}

/*
  THE NEW RULE:
  1. Find the .toggle-container that :has() a .toggle-checkbox:checked inside it.
  2. Then, use the sibling selector (~) to target the #room div that follows.
*/
.toggle-container:has(.toggle-checkbox:checked) ~ #room {
  background-color: #f1c40f; /* Bright yellow */
  color: #333;
}

.toggle-container:has(.toggle-checkbox:checked) ~ #room p::after {
  content: ' Now it\'s bright!';
}


/* --- The styles for the toggle switch itself (these are unchanged and correct) --- */
.toggle-checkbox { display: none; }
.toggle-container { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.toggle-label { display: inline-block; width: 50px; height: 28px; background-color: #ccc; border-radius: 14px; cursor: pointer; position: relative; transition: background-color 0.3s ease; }
.toggle-label::after { content: ''; position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: white; top: 2px; left: 2px; transition: transform 0.3s ease; }
.toggle-checkbox:checked + .toggle-label { background-color: #4CAF50; }
.toggle-checkbox:checked + .toggle-label::after { transform: translateX(22px); }
```

### Summary of the Fix

1.  **The Rule:** The element you are styling (`div`) must be a **sibling** of and come **after** the element you are checking (`input`).
2.  **The Problem:** In complex layouts, you often want to group the input/label in a container, which breaks the sibling relationship.
3.  **The Solution:** Use the `:has()` pseudo-class to select the container when the checkbox inside it is checked, and then use the `~` selector from there to target the `div`. This is the most robust and modern CSS-only approach.