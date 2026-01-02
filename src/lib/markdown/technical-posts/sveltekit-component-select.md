---
title: This is a SvelteKit select tag component. It provides a dropdown list. It is based on, and provides, the ListItem type.
description: This is a SvelteKit select tag component. It provides a dropdown list. It is based on, and provides, the ListItem type.
date_created: 2025-05-22T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte-component
---
## Overview

The `Select` component is a custom Svelte 5 component that wraps the native HTML `<select>` element with additional functionality for form handling and validation. It provides a type-safe interface for dropdown selections with support for form association and value binding.
## Import

```typescript
import Select from '$lib/components/Select.svelte';
import type { ListItem } from '$lib/components/Select.svelte';
```

## Interface

### ListItem

```typescript
interface ListItem {
  value: string;
  text: string;
}
```

### Component Props

```typescript
interface ComponentProps {
  elementName: string;                             // Required: The name attribute for the select element
  listItems: ListItem[];                           // Required: Array of options to display
  formId?: string;                                 // Optional: ID of the form to associate with
  selectedValue?: string | undefined | null;       // Optional: Currently selected value
  selectClass?: string | undefined | null;         // Optional: CSS class for the select element
  optionClass?: string | undefined | null;         // Optional: CSS class for option elements
}
```

## Usage Examples

### Basic Usage

```svelte
<script lang="ts">
  import Select from '$lib/components/Select.svelte';
  
  const options = [
    { value: 'option1', text: 'Option 1' },
    { value: 'option2', text: 'Option 2' },
    { value: 'option3', text: 'Option 3' }
  ];
  
  let selectedValue = 'option1';
</script>

<Select
  elementName="mySelect"
  listItems={options}
  selectedValue={selectedValue}
/>
```

### With Form Association

```svelte
<script lang="ts">
  import Select from '$lib/components/Select.svelte';
  
  const formId = 'myForm';
  const options = [
    { value: 'contains', text: 'Contains' },
    { value: 'startswith', text: 'StartsWith' },
    { value: 'equals', text: 'Equals' }
  ];
</script>

<Select
  elementName="rule"
  formId={formId}
  listItems={options}
  selectedValue="equals"
/>

<form id={formId} method="POST">
  <button type="submit">Submit</button>
</form>
```

### With Element Binding and Methods

```svelte
<script lang="ts">
  import Select from '$lib/components/Select.svelte';
  
  let selectElement: Select;
  let currentValue = $state('');
  
  const options = [
    { value: 'red', text: 'Red' },
    { value: 'green', text: 'Green' },
    { value: 'blue', text: 'Blue' }
  ];
  
  function getCurrentValue() {
    currentValue = selectElement.getValue();
  }
</script>

<Select
  bind:this={selectElement}
  elementName="color"
  listItems={options}
  selectedValue="red"
/>

<button onclick={getCurrentValue}>Get Current Value</button>
<p>Current value: {currentValue}</p>
```

### With Custom Styling

```svelte
<Select
  elementName="styledSelect"
  listItems={options}
  selectClass="custom-select"
  optionClass="custom-option"
/>
```

## Exported methods

### `getValue()`

Returns the current value of the select element.

```typescript
const currentValue = selectElement.getValue();
```

## Private methods
### `isSelectValueInList(selectedValue?: string | undefined | null): boolean`

Checks if a given value exists in the listItems array.

```typescript
const isValid = selectElement.isSelectValueInList('someValue');
```

## Features

### Form Association

The component supports HTML5 form association using the `form` attribute, allowing the select element to be part of a form even when placed outside the `<form>` tag:

```svelte
<!-- Select outside form but associated with it -->
<Select elementName="category" form="myForm" listItems={categories} />

<!-- Form in different location -->
<form id="myForm" method="POST">
  <button type="submit">Submit</button>
</form>
```

### Default Value Handling

If no `selectedValue` is provided, the component automatically selects the first item in the `listItems` array:

```typescript
// If selectedValue is null/undefined, listItems[0].value will be selected
selectedValue = selectedValue ?? listItems[0]?.value;
```

### Type Safety

The component provides full TypeScript support with proper type definitions for all props and the ListItem interface.

## Styling with Pico CSS

The component works seamlessly with [Pico CSS](https://picocss.com/) styling. Based on the attached CSS files, the select elements will automatically receive proper styling including:

- Consistent form element appearance
- Focus states and transitions
- Proper spacing and typography
- Responsive design
- Dark mode support
- Validation state styling (`aria-invalid` support)

### Custom Styling

You can apply custom styles using the `selectClass` and `optionClass` props:

```css
.custom-select {
  background-color: var(--input-background-color);
  color: var(--text-color);
  border: 1px solid var(--select-border);
}

.custom-option {
  color: black;
}

.custom-option:hover {
  color: gray;
}
```

## Best Practices

1. **Always provide a name**: The `elementName` prop is required and sets the `name` attribute for form submission.

2. **Use meaningful values**: ListItem `value` should be machine-readable, while `text` should be human-readable.

3. **Form association**: Use the `formId` prop when the select needs to be part of a form but is positioned outside the form element.

4. **Validation**: Use `isSelectValueInList()` to validate if a value exists before setting it.

5. **Accessibility**: The component inherits standard HTML select accessibility features.

## Related Components

- Works with the form handling patterns shown in +page.svelte
- Integrates with SvelteKit's `use:enhance` for progressive enhancement
- Compatible with the budget metadata from `$lib/data/budget-meta-data`

## Notes

- The component automatically handles the `selected` attribute for options
- Supports both controlled and uncontrolled usage patterns
- Falls back gracefully when `listItems` is empty
- Compatible with Svelte 5's new props and state management patterns