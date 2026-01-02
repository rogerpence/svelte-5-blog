<script lang="ts">
	import FlexSearchButton from './FlexSearchButton.svelte';

	type Props = { onTestClick: (id: string) => void };
	let { onTestClick }: Props = $props();

	function click() {
		onTestClick('abc123');
	}
</script>

<div>
	<ul class="nav__list">
		<li class="dropdown__item">
			<div class="nav__link">
				IBM i Migration
				<svg class="rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 15 320 512">
					<path
						d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
					></path>
				</svg>
			</div>
			<ul class="dropdown__menu">
				<div class="nav-spacer"></div>
				<div class="dropdown__menu--wrapper">
					<li>
						<a
							href="/en/migration"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Monarch IBM i Migration
							<div class="nav__item_subtext">Migrate your IBM i app to .NET</div>
						</a>
					</li>
					<li>
						<a
							href="/en/migration/synon-migration"
							rel="external"
							style="padding-left: 1rem"
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Synon Migration Overview
							<div class="nav__item_subtext">Migrate Synon to .NET</div>
						</a>
					</li>
					<li>
						<a
							href="/en/migration/methodology"
							rel="external"
							style="padding-left: 1rem"
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Methodology
							<div class="nav__item_subtext">Monarch Methodology</div>
						</a>
					</li>
					<li>
						<a
							href="/en/migration/encore"
							rel="external"
							style="padding-left: 1rem"
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Migration Target
							<div class="nav__item_subtext">Target EncoreRPG or C#</div>
						</a>
					</li>
					<li>
						<a
							href="/en/migration/stepwise"
							rel="external"
							style="padding-left: 1rem"
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Stepwise Migration
							<div class="nav__item_subtext">Easing your way into migration</div>
						</a>
					</li>
					<li>
						<a
							href="/en/migration/five-ways"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>5 Ways Monarch Is the Best
							<div class="nav__item_subtext">ASNA Monarch leads the way</div>
						</a>
					</li>
				</div>
			</ul>
		</li>
		<li class="dropdown__item">
			<div class="nav__link">
				Products
				<svg class="rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 15 320 512">
					<path
						d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
					></path>
				</svg>
			</div>
			<ul class="dropdown__menu">
				<div class="nav-spacer"></div>
				<div class="dropdown__menu--wrapper">
					<li>
						<a
							href="/en/products"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">All products</a
						>
					</li>
					<li>
						<a
							href="/en/products/wings"
							rel="external"
							style="padding-left: 1rem"
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>ASNA WingsRPG
							<div class="nav__item_subtext">Web UI for RPG</div>
						</a>
					</li>
					<li>
						<a
							href="/en/products/visual-rpg"
							rel="external"
							style="padding-left: 1rem"
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>ASNA Visual RPG
							<div class="nav__item_subtext">RPG compiler/IDE for .NET Framework</div>
						</a>
					</li>
					<li>
						<a
							href="/en/products/datagate"
							rel="external"
							style="padding-left: 1rem"
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>ASNA DataGate
							<div class="nav__item_subtext">Database connectivity</div>
						</a>
					</li>
				</div>
			</ul>
		</li>
		<li class="dropdown__item">
			<div class="nav__link">
				Resources
				<svg class="rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 15 320 512">
					<path
						d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
					></path>
				</svg>
			</div>
			<ul class="dropdown__menu">
				<div class="nav-spacer"></div>
				<div class="dropdown__menu--wrapper">
					<li>
						<a
							href="/technical-posts"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">Technical Posts</a
						>
					</li>
					<li>
						<a
							href="/kb"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">Knowledge Base</a
						>
					</li>
					<li>
						<a
							href="/en/tags"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Document Tag List
							<div class="nav__item_subtext">KB docs by subject</div>
						</a>
					</li>
					<li>
						<a
							href="/en/white-paper"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">White Papers</a
						>
					</li>
					<li>
						<a
							href="/en/case-study"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">Case Studies</a
						>
					</li>
					<li>
						<a
							href="/en/newsletter"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">ASNA Newsletter</a
						>
					</li>
				</div>
			</ul>
		</li>
		<li class="dropdown__item">
			<div class="nav__link">
				Support
				<svg class="rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 15 320 512">
					<path
						d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
					></path>
				</svg>
			</div>
			<ul class="dropdown__menu">
				<div class="nav-spacer"></div>
				<div class="dropdown__menu--wrapper">
					<li>
						<button class="navbar"
							>Contact Tech Support
							<div class="nav__item_subtext">Or call us at 800-984-4847</div>
						</button>
					</li>
					<li class="dropdown__menu--separator" data-svelte-h="svelte-1m6zfq4">
						<hr />
					</li>
					<li>
						<a
							href="/downloads/en"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Product downloads
							<div class="nav__item_subtext">An account is no longer necessary!</div>
						</a>
					</li>
					<li>
						<a
							href="/en/support/product-requirements"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link"
							>Product Requirements
							<div class="nav__item_subtext">Product requirements and versions</div>
						</a>
					</li>
					<li class="dropdown__menu--separator" data-svelte-h="svelte-1m6zfq4">
						<hr />
					</li>
					<li>
						<a href="https://docs.asna.com" rel="external" class="dropdown__link"
							>Product Documentation
							<i class="fa-regular fa-arrow-up-right-from-square"></i>
						</a>
					</li>
					<li>
						<a href="https://asnaqsys.github.io/" rel="external" class="dropdown__link"
							>ASNA Monarch Base Docs
							<i class="fa-regular fa-arrow-up-right-from-square"></i>
						</a>
					</li>
					<li>
						<a href="https://pronto.asna.com" rel="external" class="dropdown__link"
							>Emergency Product Keys
							<i class="fa-regular fa-arrow-up-right-from-square"></i>
						</a>
					</li>
				</div>
			</ul>
		</li>
		<li class="dropdown__item">
			<div class="nav__link">
				Company
				<svg class="rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 15 320 512">
					<path
						d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
					></path>
				</svg>
			</div>
			<ul class="dropdown__menu">
				<div class="nav-spacer"></div>
				<div class="dropdown__menu--wrapper">
					<li>
						<a
							href="/en/company/overview"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">Overview</a
						>
					</li>
					<li>
						<a
							href="/en/company/management"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">Management</a
						>
					</li>
					<li>
						<a
							href="/en/company/locations"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">Locations</a
						>
					</li>
					<li>
						<a
							href="/en/privacy"
							rel="external"
							style=""
							data-sveltekit-preload-data="hover"
							data-sveltekit-reload=""
							class="dropdown__link">ASNA Privacy Policy</a
						>
					</li>
				</div>
			</ul>
		</li>
		<FlexSearchButton></FlexSearchButton>
		<button onclick={click}>ClickMe</button>
	</ul>
</div>
