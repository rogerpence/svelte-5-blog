---
title: Svelte binding with the getter/setter pattern
description: Svelte binding with the getter/setter pattern
date_created: 2025-07-16T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
---
rogerpence: what is this line doing in this svelte 5 exmaple:

```
bind:value={() => left, updateLeft} 
```


GitHub Copilot: This line is using Svelte 5's **derived binding** syntax to create a two-way binding with a derived value.

Here's what `bind:value={() => left, updateLeft}` does:

1. **`() => left`** - This is a getter function that returns the current value of the `left` derived state
2. **`updateLeft`** - This is a setter function that gets called when the input value changes

Since `left` is a `$derived` value (calculated as `total - spent`), it's read-only by default. You can't directly bind to it with a simple `bind:value={left}` because derived values are computed from other state.

The derived binding syntax allows you to:
- **Read** the derived value through the getter function
- **Write** to it indirectly through the setter function, which updates the underlying state (`spent`) that the derived value depends on

When the user moves the second range slider:
1. The input calls `updateLeft(newValue)`
2. `updateLeft` calculates and updates `spent = total - left`
3. This causes `left` to be recalculated automatically
4. Both sliders stay in sync

This pattern is useful when you want to provide multiple ways to interact with related data (in this case, adjusting either "spent" or "left" amounts).

rogerpence: how does 'left' and 'updateLeft' interact on that line. Is that two separate function calls

GitHub Copilot: No, it's **not** two separate function calls. The syntax `() => left, updateLeft` is a **single expression** using the **comma operator**.

Here's how it works:

1. **`() => left, updateLeft`** evaluates to just **`updateLeft`** (the comma operator returns the last value)
2. But Svelte's compiler recognizes this specific pattern and treats it as a **getter/setter pair**:
   - **Getter**: `() => left` - function that returns the current value
   - **Setter**: `updateLeft` - function that handles updates

So the bind directive receives:
- A getter function to read the current value of `left`
- A setter function to update the underlying state when the input changes

When the range slider moves:
1. Svelte calls `updateLeft(newValue)` with the new slider value
2. `updateLeft` sets `spent = total - left` 
3. This causes `left` to be recalculated (since it's `$derived(total - spent)`)
4. Svelte calls the getter `() => left` to get the updated value for display

This pattern allows you to bind to derived/computed values that can't be directly mutated, by providing both a way to read the current value and a way to update the underlying state that the derived value depends on.

rogerpence: does that then pass the current value of 'left' to the 'updateLeft' function

GitHub Copilot: No, the getter function `() => left` doesn't pass the current value to `updateLeft`.

Here's what actually happens:

1. **The getter `() => left`** is used by Svelte to **read** the current value for display in the input
2. **The setter `updateLeft`** receives the **new value from the input** when the user moves the slider

So the flow is:
- User moves the slider to a new position (e.g., 30)
- Svelte calls `updateLeft(30)` with the new slider value
- `updateLeft` calculates `spent = total - left` → `spent = 100 - 30` → `spent = 70`
- The `left` derived value recalculates: `left = total - spent` → `left = 100 - 70` → `left = 30`
- Svelte calls the getter `() => left` to update the input's displayed value

The current value of `left` is **not** passed to `updateLeft`. Instead, `updateLeft` receives whatever new value the user set on the range slider, then updates the underlying `spent` state accordingly.

This creates a bidirectional relationship where both sliders stay in sync - moving either the "spent" slider or the "left" slider updates the other automatically.

rogerpence: I don't understand how 'updateLeft' is called with the correct argument

GitHub Copilot: Great question! The key is understanding how Svelte's binding system works.

When you write `bind:value={() => left, updateLeft}`, Svelte's compiler recognizes this as a **getter/setter pair** and automatically handles calling `updateLeft` with the correct argument.

Here's what Svelte does behind the scenes:

1. **When the input value changes** (user moves the slider), Svelte automatically calls:
   ```javascript
   updateLeft(newInputValue)
   ```

2. **The `newInputValue`** comes directly from the range input's current position - Svelte passes whatever value the user set on the slider

So if the user drags the "left" slider to position 30:
- The range input's value becomes 30
- Svelte automatically calls `updateLeft(30)`
- Your function executes: `spent = total - left` → `spent = 100 - 30` → `spent = 70`
- The derived `left` recalculates and stays at 30

**You don't need to manually pass arguments** - Svelte's binding system handles this automatically. The setter function (`updateLeft`) will always receive the new value from the input element as its first parameter.

This is part of Svelte's "magic" - it automatically wires up the data flow between the DOM input and your state management functions.

rogerpence: so it's the bind: value that gets the currently value to the 'updateLeft' function

GitHub Copilot: Yes, exactly! 

The `bind:value` directive is what handles getting the current input value to the `updateLeft` function.

When you write `bind:value={() => left, updateLeft}`:

1. **`bind:value`** creates a two-way binding with the input element
2. When the user moves the slider, **`bind:value`** automatically captures the new input value
3. **`bind:value`** then calls `updateLeft(newValue)` with that captured value

So the flow is:
- User drags slider to position 30
- **`bind:value`** detects the input change and gets the value `30`
- **`bind:value`** calls `updateLeft(30)`
- Your function executes: `spent = total - 30 = 70`

The `bind:value` directive is doing all the heavy lifting - it's monitoring the input for changes and automatically calling your setter function with the new value. You don't have to manually wire up event listeners or extract values from DOM events.

This is the core of Svelte's reactivity system - the binding directives handle the connection between DOM elements and your JavaScript functions/state.

rogerpence: I know I seem a little slow... but after that call to 'updateLeft' the new derived value of 'left' gets assigned to the bind:value, right?

GitHub Copilot: You're not slow at all - this is a subtle but important distinction!

After `updateLeft` is called, the new derived value of `left` doesn't get "assigned" to `bind:value`. Instead:

1. User moves slider → `bind:value` calls `updateLeft(newValue)`
2. `updateLeft` updates `spent = total - newValue`
3. `left` automatically recalculates (because it's `$derived(total - spent)`)
4. `bind:value` calls the **getter function** `() => left` to **read** the updated value
5. The input's display value updates to match the new `left` value

So it's more accurate to say that `bind:value` **reads** the new derived value using the getter function, rather than having it "assigned" to it.

The flow is:
- **Write**: `bind:value` → `updateLeft()` → updates `spent` → `left` recalculates
- **Read**: `bind:value` → `(() => left)()` → gets current `left` value → updates input display

The `bind:value` is constantly **synchronizing** between the input and your state using both the getter (to read) and setter (to write), rather than having values assigned to it.

This two-way synchronization is what keeps both sliders perfectly in sync!

rogerpence: I said it this way: " new derived value of 'left' gets assigned to the bind:value,"
isn't that what steps 4 and 5 are doing

GitHub Copilot: You're absolutely right! I was being overly pedantic about the word "assigned."

Yes, steps 4 and 5 are essentially doing what you described - the new derived value of `left` gets assigned to the `bind:value`.

When I said:
4. `bind:value` calls the getter function `() => left` to read the updated value
5. The input's display value updates to match the new `left` value

That **is** the new derived value of `left` getting assigned to the `bind:value`! 

The `bind:value` directive takes that returned value from the getter and assigns it to the input element's value property, which updates what the user sees on the slider.

So your understanding is correct - after `updateLeft` runs and `left` recalculates, that new derived value does get assigned back to the `bind:value` to keep the input synchronized with the state.

Thanks for pushing back on my explanation - you were right to call that out!

rogerpence: witht his comma-separated syntax, is the getter always on the left and setter on the right?

GitHub Copilot: Yes, with this comma-separated syntax in Svelte 5, the **getter is always on the left** and the **setter is always on the right**.

The pattern is:
```svelte
bind:value={getter, setter}
```

So in your example:
- `() => left` (left side) = **getter function**
- `updateLeft` (right side) = **setter function**

This is a consistent convention in Svelte 5's derived binding syntax. The order matters because Svelte's compiler expects:
1. First expression = how to read the current value
2. Second expression = how to handle updates

If you swapped them around like `bind:value={updateLeft, () => left}`, it wouldn't work correctly because Svelte would try to use `updateLeft` as the getter and `() => left` as the setter.

So yes, it's always **getter, setter** - left to right.

rogerpence: very interesting. Svelte 5 has a lot more subtle power than Svelte 4

GitHub Copilot: Absolutely! Svelte 5 is a major leap forward in terms of both power and elegance.

This getter/setter binding syntax is a perfect example - it solves a real problem that was clunky in Svelte 4. Before, if you wanted to bind to a computed/derived value, you'd have to:

1. Create a separate writable store
2. Use reactive statements with `$:` 
3. Manually sync between multiple pieces of state
4. Often end up with complex, hard-to-follow reactive chains

Now with Svelte 5's runes and this binding syntax, you can:
- Use `$derived` for clean, declarative computed state
- Bind directly to derived values with simple getter/setter pairs
- Keep all the logic in one place and easy to reason about

The runes system (`$state`, `$derived`, `$effect`) really unlocks a lot of subtle but powerful patterns like this. It feels much more like modern reactive programming while still maintaining Svelte's simplicity.

Plus the fact that this binding pattern automatically handles the bidirectional sync between both sliders with just a few lines of code - that's the kind of "it just works" magic that makes Svelte special, but now with even more control and clarity about what's happening under the hood.