---
title: Dynamic Svelte Components
description: Dynamic Svelte Components
date_created: '2025-07-17T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - svelte
---
How can you dyamically instance a Svete 5 component. I

GitHub Copilot: In Svelte 5, you can dynamically instantiate components using the `{@render}` directive with component constructors, or by using the `<svelte:component>` element. Here are the main approaches:

## Method 1: Using `<svelte:component>` (Most Common)

````svelte
<script lang="ts">
	import ComponentA from './ComponentA.svelte';
	import ComponentB from './ComponentB.svelte';

	const config = {
		orange: {
			size: 'large',
			rate: 3,
			component: ComponentA
		},
		blue: {
			size: 'large',
			rate: 3,
			component: ComponentB
		}
	};

	let selectedConfig = $state('orange');

	function readConfig() {
		return config[selectedConfig];
	}
</script>

<svelte:component
	this={readConfig().component}
	size={readConfig().size}
	rate={readConfig().rate}
/>

<button onclick={() => selectedConfig = selectedConfig === 'orange' ? 'blue' : 'orange'}>
	Switch Component
</button>
````

## Method 2: Using Component Map

````svelte
<script lang="ts">
	import ComponentA from './ComponentA.svelte';
	import ComponentB from './ComponentB.svelte';

	const components = {
		ComponentA,
		ComponentB
	};

	const config = {
		orange: {
			size: 'large',
			rate: 3,
			componentName: 'ComponentA'
		},
		blue: {
			size: 'large',
			rate: 3,
			componentName: 'ComponentB'
		}
	};

	let currentKey = $state('orange');

	function readConfig() {
		const cfg = config[currentKey];
		return {
			...cfg,
			component: components[cfg.componentName]
		};
	}
</script>

<svelte:component
	this={readConfig().component}
	{...readConfig()}
/>
````

## Method 3: Programmatic Instantiation

````svelte
<script lang="ts">
	import { mount } from 'svelte';
	import ComponentA from './ComponentA.svelte';

	const config = {
		orange: {
			size: 'large',
			rate: 3
		},
		blue: {
			size: 'large',
			rate: 3
		}
	};

	let container = $state();

	function readConfig() {
		// Programmatically mount component
		if (container) {
			mount(ComponentA, {
				target: container,
				props: config.orange
			});
		}
	}
</script>

<div bind:this={container}></div>
<button onclick={readConfig}>Mount Component</button>
````

The `<svelte:component>` approach (Method 1) is usually the most straightforward for dynamic component rendering in Svelte 5.

rogerpence: I want to reqad the config json (which will later be external to the page) where the compenent name is named in the Json's  top-level keys. I want to instance each component listed and pass it  all of the properties listed for it

GitHub Copilot: Here's how you can dynamically instantiate components based on the JSON config where the component names are the top-level keys:

````svelte
<script lang="ts">
	// Import your components
	import Orange from './Orange.svelte';
	import Blue from './Blue.svelte';

	// Component registry - maps config keys to actual components
	const componentRegistry = {
		orange: Orange,
		blue: Blue
	};

	const config = {
		orange: {
			size: 'large',
			rate: 3
		},
		blue: {
			size: 'large',
			length: 'medium'
		}
	};

	function readConfig() {
		return Object.entries(config).map(([componentName, props]) => ({
			component: componentRegistry[componentName],
			props,
			name: componentName
		}));
	}

	// Get all components to render
	const componentsToRender = readConfig();
</script>

<!-- Render each component with its props -->
{#each componentsToRender as { component, props, name } (name)}
	{#if component}
		<div class="component-wrapper" data-component={name}>
			<h3>Component: {name}</h3>
			<svelte:component this={component} {...props} />
		</div>
	{:else}
		<div class="error">Component "{name}" not found in registry</div>
	{/if}
{/each}

<style>
	.component-wrapper {
		margin: 1rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.error {
		color: red;
		padding: 1rem;
		background: #fee;
		border-radius: 4px;
	}
</style>
````

Or if you prefer a more dynamic approach that doesn't require pre-importing all components:

````svelte
<script lang="ts">
	const config = {
		orange: {
			size: 'large',
			rate: 3
		},
		blue: {
			size: 'large',
			length: 'medium'
		}
	};

	// Dynamic import function
	async function loadComponent(name: string) {
		try {
			const module = await import(`./${name.charAt(0).toUpperCase() + name.slice(1)}.svelte`);
			return module.default;
		} catch (error) {
			console.error(`Failed to load component: ${name}`, error);
			return null;
		}
	}

	// Load all components
	let components = $state([]);

	async function readConfig() {
		const loadedComponents = [];

		for (const [componentName, props] of Object.entries(config)) {
			const component = await loadComponent(componentName);
			if (component) {
				loadedComponents.push({
					component,
					props,
					name: componentName
				});
			}
		}

		components = loadedComponents;
	}

	// Load components on mount
	readConfig();
</script>

<!-- Render each loaded component -->
{#each components as { component, props, name } (name)}
	<div class="component-wrapper" data-component={name}>
		<h3>Component: {name}</h3>
		<svelte:component this={component} {...props} />
	</div>
{/each}
````

The first approach with the component registry is more performant and easier to debug, while the second approach with dynamic imports is more flexible for external configs.

rogerpence: how do define the component to get the properties from ...props

GitHub Copilot: In your components (Orange.svelte and Blue.svelte), you need to define the props that will be received from the `{...props}` spread. Here's how:

## Orange.svelte
````svelte
<script lang="ts">
	// Define the props this component expects
	let { size, rate } = $props();
</script>

<div class="orange-component">
	<p>Orange Component</p>
	<p>Size: {size}</p>
	<p>Rate: {rate}</p>
</div>

<style>
	.orange-component {
		background: orange;
		padding: 1rem;
		border-radius: 4px;
	}
</style>
````

## Blue.svelte
````svelte
<script lang="ts">
	// Define the props this component expects
	let { size, length } = $props();
</script>

<div class="blue-component">
	<p>Blue Component</p>
	<p>Size: {size}</p>
	<p>Length: {length}</p>
</div>

<style>
	.blue-component {
		background: lightblue;
		padding: 1rem;
		border-radius: 4px;
	}
</style>
````

## With Optional Props and Defaults
````svelte
<script lang="ts">
	// With default values and optional props
	let {
		size = 'medium',
		rate = 1,
		color = 'orange'
	} = $props();
</script>

<div class="component" style="background: {color}">
	<p>Size: {size}</p>
	<p>Rate: {rate}</p>
</div>
````

## With TypeScript Interface
````svelte
<script lang="ts">
	interface Props {
		size: 'small' | 'medium' | 'large';
		rate: number;
		color?: string;
	}

	let { size, rate, color = 'orange' }: Props = $props();
</script>
````

When you use `{...props}` in `<svelte:component this={component} {...props} />`, it spreads all the properties from your config object as individual props to the component. The component then receives them through the `$props()` destructuring.

rogerpence: how can I make it reactive so that when another component definition is added to the config json that component gets rendered at runtime

GitHub Copilot: To make it reactive so that when another component definition is added to the config, it gets rendered at runtime, you need to convert the `config` from a constant to reactive state and update how you handle the component rendering:

````svelte
<script lang="ts">
	// Import your components
	import Orange from '$lib/components/Orange.svelte';
	import Blue from '$lib/components/Blue.svelte';
	import Green from '$lib/components/Green.svelte'; // Add more as needed

	// Component registry - maps config keys to actual components
	const componentRegistry = {
		orange: Orange,
		blue: Blue,
		green: Green
	};

	// Make config reactive using $state
	let config = $state({
		orange: {
			size: 'large',
			rate: 3
		},
		blue: {
			size: 'large',
			length: 'medium'
		}
	});

	// Make this a derived value that updates when config changes
	let componentsToRender = $derived(
		Object.entries(config).map(([componentName, props]) => ({
			component: componentRegistry[componentName],
			props,
			name: componentName
		}))
	);

	// Function to add new component configuration
	function addComponent(name: string, props: Record<string, any>) {
		config = {
			...config,
			[name]: props
		};
	}

	// Function to remove component configuration
	function removeComponent(name: string) {
		const newConfig = { ...config };
		delete newConfig[name];
		config = newConfig;
	}

	// Example functions to test reactivity
	function addGreenComponent() {
		addComponent('green', {
			size: 'small',
			intensity: 'bright'
		});
	}

	function removeOrangeComponent() {
		removeComponent('orange');
	}

	// Function to load external config (for later use)
	async function loadExternalConfig() {
		try {
			const response = await fetch('/api/components-config');
			const externalConfig = await response.json();
			config = externalConfig;
		} catch (error) {
			console.error('Failed to load external config:', error);
		}
	}
</script>

<!-- Test buttons -->
<div class="controls">
	<button onclick={addGreenComponent}>Add Green Component</button>
	<button onclick={removeOrangeComponent}>Remove Orange Component</button>
	<button onclick={loadExternalConfig}>Load External Config</button>
</div>

<!-- Render each component with its props -->
{#each componentsToRender as { component, props, name } (name)}
	{#if component}
		<div class="component-wrapper" data-component={name}>
			<h3>Component: {name}</h3>
			<svelte:component this={component} {...props} />
		</div>
	{:else}
		<div class="error">Component "{name}" not found in registry</div>
	{/if}
{/each}

<style>
	.controls {
		margin-bottom: 2rem;
		display: flex;
		gap: 1rem;
	}

	.controls button {
		padding: 0.5rem 1rem;
		background: #007acc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.controls button:hover {
		background: #005999;
	}

	.component-wrapper {
		margin: 1rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.error {
		color: red;
		padding: 1rem;
		background: #fee;
		border-radius: 4px;
	}
</style>
````

## For External JSON File Updates

If you want to automatically detect changes to an external JSON file, you could use polling or WebSockets:

````svelte
<script lang="ts">
	// ...existing code...

	// Poll for config changes every 5 seconds
	let pollInterval: number;

	async function pollForConfigChanges() {
		try {
			const response = await fetch('/api/components-config?t=' + Date.now());
			const newConfig = await response.json();

			// Only update if config actually changed
			if (JSON.stringify(newConfig) !== JSON.stringify(config)) {
				config = newConfig;
				console.log('Config updated from external source');
			}
		} catch (error) {
			console.error('Failed to poll for config changes:', error);
		}
	}

	// Start polling when component mounts
	$effect(() => {
		pollInterval = setInterval(pollForConfigChanges, 5000);

		// Cleanup on unmount
		return () => {
			if (pollInterval) {
				clearInterval(pollInterval);
			}
		};
	});
</script>
````

The key changes:
1. **`config` is now reactive** using `$state()`
2. **`componentsToRender` is now derived** using `$derived()` so it automatically updates when `config` changes
3. **Helper functions** to add/remove components dynamically
4. **Optional polling** to detect external file changes

Now whenever you modify the `config` object, the component list will automatically re-render with the new configuration!

rogerpence: svelte:component is deprecated in svelte 5

GitHub Copilot: You're right! In Svelte 5, `<svelte:component>` is deprecated. Here's how to update your code to use the modern Svelte 5 approach with snippets and render functions:

````svelte
<script lang="ts">
    // Import your components
    import Orange from '$lib/components/Orange.svelte';
    import Blue from '$lib/components/Blue.svelte';
    import Green from '$lib/components/Green.svelte';

    // Component registry - maps config keys to actual components
    const componentRegistry = {
        orange: Orange,
        blue: Blue,
        green: Green
    };

    // Make config reactive using $state
    let config = $state({
        orange: {
            size: 'large',
            rate: 3
        },
        blue: {
            size: 'large',
            length: 'medium'
        }
    });

    // Make this a derived value that updates when config changes
    let componentsToRender = $derived(
        Object.entries(config).map(([componentName, props]) => ({
            component: componentRegistry[componentName],
            props,
            name: componentName
        }))
    );

    // Function to add new component configuration
    function addComponent(name: string, props: Record<string, any>) {
        config = {
            ...config,
            [name]: props
        };
    }

    // Function to remove component configuration
    function removeComponent(name: string) {
        const newConfig = { ...config };
        delete newConfig[name];
        config = newConfig;
    }

    // Example functions to test reactivity
    function addGreenComponent() {
        addComponent('green', {
            size: 'small',
            intensity: 'bright'
        });
    }

    function removeOrangeComponent() {
        removeComponent('orange');
    }

    // Function to load external config (for later use)
    async function loadExternalConfig() {
        try {
            const response = await fetch('/api/components-config');
            const externalConfig = await response.json();
            config = externalConfig;
        } catch (error) {
            console.error('Failed to load external config:', error);
        }
    }

    // Helper function to render component dynamically
    function renderComponent(component: any, props: Record<string, any>) {
        return component ? new component({ target: document.createElement('div'), props }) : null;
    }
</script>

<!-- Test buttons -->
<div class="controls">
    <button onclick={addGreenComponent}>Add Green Component</button>
    <button onclick={removeOrangeComponent}>Remove Orange Component</button>
    <button onclick={loadExternalConfig}>Load External Config</button>
</div>

<!-- Render each component with its props using snippets -->
{#each componentsToRender as { component, props, name } (name)}
    {#if component}
        <div class="component-wrapper" data-component={name}>
            <h3>Component: {name}</h3>
            {@render componentSnippet(component, props)}
        </div>
    {:else}
        <div class="error">Component "{name}" not found in registry</div>
    {/if}
{/each}

{#snippet componentSnippet(Component, props)}
    <Component {...props} />
{/snippet}

<style>
    .controls {
        margin-bottom: 2rem;
        display: flex;
        gap: 1rem;
    }

    .controls button {
        padding: 0.5rem 1rem;
        background: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .controls button:hover {
        background: #005999;
    }

    .component-wrapper {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .error {
        color: red;
        padding: 1rem;
        background: #fee;
        border-radius: 4px;
    }
</style>
````

The key changes for Svelte 5:

1. **Replaced `<svelte:component>`** with `{@render componentSnippet(component, props)}`
2. **Added a snippet** `{#snippet componentSnippet(Component, props)}` that renders the component
3. **Used `<Component {...props} />`** inside the snippet to render the actual component

This approach uses Svelte 5's modern snippet system instead of the deprecated `<svelte:component>` directive, while maintaining the same dynamic component rendering functionality.

rogerpence: what is keeping it from leeting me add multiple green components

GitHub Copilot: The issue is that your `addComponent` function uses the component name as the key, so when you add a second "green" component, it overwrites the first one instead of creating a new instance.

Here's how to fix it to allow multiple instances of the same component type:

````svelte
<script lang="ts">
	// Import your components
	import Orange from '$lib/components/Orange.svelte';
	import Blue from '$lib/components/Blue.svelte';
	import Green from '$lib/components/Green.svelte';

	// Component registry - maps config keys to actual components
	const componentRegistry = {
		orange: Orange,
		blue: Blue,
		green: Green
	};

	// Make config reactive using $state - now uses unique IDs as keys
	let config = $state({
		'orange-1': {
			componentType: 'orange',
			size: 'large',
			rate: 3
		},
		'blue-1': {
			componentType: 'blue',
			size: 'large',
			length: 'medium'
		}
	});

	// Counter for generating unique IDs
	let componentCounter = $state(2);

	// Make this a derived value that updates when config changes
	let componentsToRender = $derived(
		Object.entries(config).map(([instanceId, configData]) => ({
			component: componentRegistry[configData.componentType],
			props: { ...configData, componentType: undefined }, // Remove componentType from props
			name: instanceId,
			componentType: configData.componentType
		}))
	);

	// Function to add new component configuration with unique ID
	function addComponent(componentType: string, props: Record<string, any>) {
		const instanceId = `${componentType}-${componentCounter}`;
		componentCounter++;

		config = {
			...config,
			[instanceId]: {
				componentType,
				...props
			}
		};
	}

	// Function to remove component configuration
	function removeComponent(instanceId: string) {
		const newConfig = { ...config };
		delete newConfig[instanceId];
		config = newConfig;
	}

	// Example functions to test reactivity
	function addGreenComponent() {
		addComponent('green', {
			size: 'small',
			intensity: 'bright'
		});
	}

	function addAnotherGreenComponent() {
		addComponent('green', {
			size: 'large',
			intensity: 'dim'
		});
	}

	function removeOrangeComponent() {
		removeComponent('orange-1');
	}

	// Function to load external config (for later use)
	async function loadExternalConfig() {
		try {
			const response = await fetch('/api/components-config');
			const externalConfig = await response.json();
			config = externalConfig;
		} catch (error) {
			console.error('Failed to load external config:', error);
		}
	}
</script>

<!-- Test buttons -->
<div class="controls">
	<button onclick={addGreenComponent}>Add Green Component</button>
	<button onclick={addAnotherGreenComponent}>Add Another Green Component</button>
	<button onclick={removeOrangeComponent}>Remove Orange Component</button>
	<button onclick={loadExternalConfig}>Load External Config</button>
</div>

<!-- Render each component with its props using snippets -->
{#each componentsToRender as { component, props, name, componentType } (name)}
	{#if component}
		<div class="component-wrapper" data-component={name}>
			<h3>Component: {name} ({componentType})</h3>
			{@render componentSnippet(component, props)}
			<button onclick={() => removeComponent(name)} class="remove-btn">Remove This Instance</button>
		</div>
	{:else}
		<div class="error">Component type "{componentType}" not found in registry</div>
	{/if}
{/each}

{#snippet componentSnippet(Component, props)}
	<Component {...props} />
{/snippet}

<style>
	.controls {
		margin-bottom: 2rem;
		display: flex;
		gap: 1rem;
	}

	.controls button {
		padding: 0.5rem 1rem;
		background: #007acc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.controls button:hover {
		background: #005999;
	}

	.component-wrapper {
		margin: 1rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		position: relative;
	}

	.remove-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.5rem;
		background: #dc3545;
		color: white;
		border: none;
		border-radius: 3px;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.remove-btn:hover {
		background: #c82333;
	}

	.error {
		color: red;
		padding: 1rem;
		background: #fee;
		border-radius: 4px;
	}
</style>
````

Key changes:

1. **Unique instance IDs**: Instead of using component type as the key, each instance gets a unique ID like `green-1`, `green-2`, etc.

2. **Component type tracking**: Added `componentType` field to track what type of component each instance is

3. **Counter for uniqueness**: Added `componentCounter` to generate unique IDs

4. **Multiple green buttons**: Added a second button to demonstrate adding multiple green components

5. **Individual remove buttons**: Each component instance now has its own remove button

Now you can add as many green (or any other) components as you want, and each will be a separate instance with its own configuration!

rogerpence: add up and down buttons for each component that would move that component up or down in the json to change the order of the components

GitHub Copilot: Here's how to add up and down buttons to reorder the components:

````svelte
<script lang="ts">
	// Import your components
	import Orange from '$lib/components/Orange.svelte';
	import Blue from '$lib/components/Blue.svelte';
	import Green from '$lib/components/Green.svelte';

	// Component registry - maps config keys to actual components
	const componentRegistry = {
		orange: Orange,
		blue: Blue,
		green: Green
	};

	// Make config reactive using $state - now uses unique IDs as keys
	let config = $state({
		'orange-1': {
			componentType: 'orange',
			size: 'large',
			rate: 3
		},
		'blue-1': {
			componentType: 'blue',
			size: 'large',
			length: 'medium'
		}
	});

	// Counter for generating unique IDs
	let componentCounter = $state(2);

	// Make this a derived value that updates when config changes
	let componentsToRender = $derived(
		Object.entries(config).map(([instanceId, configData]) => ({
			component: componentRegistry[configData.componentType],
			props: { ...configData, componentType: undefined }, // Remove componentType from props
			name: instanceId,
			componentType: configData.componentType
		}))
	);

	// Function to add new component configuration with unique ID
	function addComponent(componentType: string, props: Record<string, any>) {
		const instanceId = `${componentType}-${componentCounter}`;
		componentCounter++;

		config = {
			...config,
			[instanceId]: {
				componentType,
				...props
			}
		};
	}

	// Function to remove component configuration
	function removeComponent(instanceId: string) {
		const newConfig = { ...config };
		delete newConfig[instanceId];
		config = newConfig;
	}

	// Function to move component up in order
	function moveComponentUp(instanceId: string) {
		const entries = Object.entries(config);
		const currentIndex = entries.findIndex(([id]) => id === instanceId);

		if (currentIndex > 0) {
			// Swap with previous item
			[entries[currentIndex - 1], entries[currentIndex]] = [entries[currentIndex], entries[currentIndex - 1]];

			// Rebuild config object in new order
			config = Object.fromEntries(entries);
		}
	}

	// Function to move component down in order
	function moveComponentDown(instanceId: string) {
		const entries = Object.entries(config);
		const currentIndex = entries.findIndex(([id]) => id === instanceId);

		if (currentIndex < entries.length - 1) {
			// Swap with next item
			[entries[currentIndex], entries[currentIndex + 1]] = [entries[currentIndex + 1], entries[currentIndex]];

			// Rebuild config object in new order
			config = Object.fromEntries(entries);
		}
	}

	// Example functions to test reactivity
	function addGreenComponent() {
		addComponent('green', {
			size: 'small',
			intensity: 'bright'
		});
	}

	function addAnotherGreenComponent() {
		addComponent('green', {
			size: 'large',
			intensity: 'dim'
		});
	}

	function removeOrangeComponent() {
		removeComponent('orange-1');
	}

	// Function to load external config (for later use)
	async function loadExternalConfig() {
		try {
			const response = await fetch('/api/components-config');
			const externalConfig = await response.json();
			config = externalConfig;
		} catch (error) {
			console.error('Failed to load external config:', error);
		}
	}
</script>

<!-- Test buttons -->
<div class="controls">
	<button onclick={addGreenComponent}>Add Green Component</button>
	<button onclick={addAnotherGreenComponent}>Add Another Green Component</button>
	<button onclick={removeOrangeComponent}>Remove Orange Component</button>
	<button onclick={loadExternalConfig}>Load External Config</button>
</div>

<!-- Render each component with its props using snippets -->
{#each componentsToRender as { component, props, name, componentType }, index (name)}
	{#if component}
		<div class="component-wrapper" data-component={name}>
			<div class="component-controls">
				<button
					onclick={() => moveComponentUp(name)}
					class="move-btn up-btn"
					disabled={index === 0}
					title="Move up"
				>
					↑
				</button>
				<button
					onclick={() => moveComponentDown(name)}
					class="move-btn down-btn"
					disabled={index === componentsToRender.length - 1}
					title="Move down"
				>
					↓
				</button>
				<button onclick={() => removeComponent(name)} class="remove-btn" title="Remove">
					×
				</button>
			</div>
			<h3>Component: {name} ({componentType})</h3>
			{@render componentSnippet(component, props)}
		</div>
	{:else}
		<div class="error">Component type "{componentType}" not found in registry</div>
	{/if}
{/each}

{#snippet componentSnippet(Component, props)}
	<Component {...props} />
{/snippet}

<style>
	.controls {
		margin-bottom: 2rem;
		display: flex;
		gap: 1rem;
	}

	.controls button {
		padding: 0.5rem 1rem;
		background: #007acc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.controls button:hover {
		background: #005999;
	}

	.component-wrapper {
		margin: 1rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		position: relative;
	}

	.component-controls {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		gap: 0.25rem;
	}

	.move-btn, .remove-btn {
		padding: 0.25rem 0.5rem;
		color: white;
		border: none;
		border-radius: 3px;
		font-size: 0.8rem;
		cursor: pointer;
		font-weight: bold;
		min-width: 24px;
		text-align: center;
	}

	.move-btn {
		background: #6c757d;
	}

	.move-btn:hover:not(:disabled) {
		background: #5a6268;
	}

	.move-btn:disabled {
		background: #dee2e6;
		color: #6c757d;
		cursor: not-allowed;
	}

	.remove-btn {
		background: #dc3545;
	}

	.remove-btn:hover {
		background: #c82333;
	}

	.error {
		color: red;
		padding: 1rem;
		background: #fee;
		border-radius: 4px;
	}
</style>
````

Key changes:

1. **Added `moveComponentUp()` and `moveComponentDown()` functions** that:
   - Find the current position of the component in the config
   - Swap it with the adjacent component
   - Rebuild the config object in the new order

2. **Added component controls section** with three buttons:
   - Up arrow (↑) to move component up
   - Down arrow (↓) to move component down
   - × to remove the component

3. **Added index tracking** in the `{#each}` loop to know when to disable buttons:
   - Up button is disabled for the first component
   - Down button is disabled for the last component

4. **Updated styling** to accommodate the new button layout and disabled states

Now you can reorder components by clicking the up/down arrows, and the JSON config will be updated to reflect the new order!

rogerpence: does it increase complexity too much to have a single addComponent that is able to the type of component specified

GitHub Copilot: Not at all! A single generic `addComponent` function with a component type parameter actually **reduces** complexity. Here's how you can refactor it:

````svelte
<script lang="ts">
	// ...existing code...

	// Single generic function to add any component type
	function addComponent(componentType: string, props: Record<string, any> = {}) {
		const instanceId = `${componentType}-${componentCounter}`;
		componentCounter++;

		config = {
			...config,
			[instanceId]: {
				componentType,
				...props
			}
		};
	}

	// Simplified specific functions (optional - you could call addComponent directly)
	function addGreenComponent() {
		addComponent('green', {
			size: 'small',
			intensity: 'bright'
		});
	}

	function addAnotherGreenComponent() {
		addComponent('green', {
			size: 'large',
			intensity: 'dim'
		});
	}

	// Or even simpler - just use the generic function directly
	function addOrangeComponent() {
		addComponent('orange', { size: 'medium', rate: 5 });
	}

	function addBlueComponent() {
		addComponent('blue', { size: 'small', length: 'long' });
	}

	// ...rest of existing code...
</script>

<!-- More flexible test buttons -->
<div class="controls">
	<button onclick={() => addComponent('green', { size: 'small', intensity: 'bright' })}>
		Add Green (Small)
	</button>
	<button onclick={() => addComponent('green', { size: 'large', intensity: 'dim' })}>
		Add Green (Large)
	</button>
	<button onclick={() => addComponent('orange', { size: 'medium', rate: 5 })}>
		Add Orange
	</button>
	<button onclick={() => addComponent('blue', { size: 'tiny', length: 'short' })}>
		Add Blue
	</button>
	<button onclick={removeOrangeComponent}>Remove Orange Component</button>
	<button onclick={loadExternalConfig}>Load External Config</button>
</div>

<!-- ...rest of existing template... -->
````

## Benefits of this approach:

1. **Less code duplication** - one function handles all component types
2. **More flexible** - easy to add new component types without new functions
3. **Consistent behavior** - all components get added the same way
4. **Easier to maintain** - changes to add logic only need to happen in one place
5. **Better for dynamic scenarios** - you could even build a dropdown to select component type

## Even more advanced - with a component selector:

````svelte
<script lang="ts">
	// ...existing code...

	let selectedComponentType = $state('green');
	let componentProps = $state({ size: 'medium' });

	function addSelectedComponent() {
		addComponent(selectedComponentType, componentProps);
	}
</script>

<div class="controls">
	<select bind:value={selectedComponentType}>
		<option value="green">Green</option>
		<option value="orange">Orange</option>
		<option value="blue">Blue</option>
	</select>

	<input bind:value={componentProps.size} placeholder="Size" />

	<button onclick={addSelectedComponent}>Add Selected Component</button>

	<!-- Keep your existing quick-add buttons too -->
	<button onclick={() => addComponent('green', { size: 'small', intensity: 'bright' })}>
		Quick Add Green
	</button>
</div>
````

This approach is actually **simpler** and more maintainable than having separate functions for each component type!