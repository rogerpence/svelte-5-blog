---
title: svelte-component-input
description: svelte-component-input
date_created: 2025-05-22T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte-component
---
Properties:
- `domName`: string;
- `labelText`: string;
- `value`?: string | number;
- `required`?: boolean;
- `errorMessage`?: string;
- `placeholder`?: string;
- `className`?: string;
- `surroundWithFormFieldDiv`?: boolean;

## Component source code:

```ts
<script lang="ts">
	import { core } from 'zod/v4';

	interface ComponentProps {
		domName: string;
		labelText: string;
		value?: string | number;
		required?: boolean;
		errorMessage?: string;
		placeholder?: string;
		className?: string;
		surroundWithFormFieldDiv?: boolean;
	}

	const {
		domName,
		labelText,
		value,
		required = true,
		errorMessage,
		placeholder,
		className,
		surroundWithFormFieldDiv = true
	}: ComponentProps = $props();

	let fieldValue = $state(value ?? '');
</script>

{#snippet inputHTML()}
	<label for={domName}>{labelText}</label>
	<input
		type="text"
		id={domName}
		name={domName}
		bind:value={fieldValue}
		{required}
		placeholder={placeholder ?? ''}
		class={className ?? ''}
	/>
	{#if errorMessage}
		<div class="error-message">{errorMessage}</div>
	{/if}
{/snippet}

{#if surroundWithFormFieldDiv}
	<div>
		{@render inputHTML()}
	</div>
{:else}
	{@render inputHTML()}
{/if}
```