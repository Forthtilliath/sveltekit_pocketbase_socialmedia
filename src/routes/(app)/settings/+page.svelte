<script context="module">
	export const authModelKey = { name: 'authModel' };
</script>

<script lang="ts">
	import AccountSettings from './account-settings.svelte';
	import Profile from './profile.svelte';
	import Security from './security.svelte';
	import { setContext } from 'svelte';

	export let data;

	setContext(authModelKey, data.authModel);
</script>

<svelte:head>
	<title>Settings - CS</title>
</svelte:head>

<article>
	<AccountSettings />

	<div class="right">
		<Profile />

		<Security />
	</div>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 700px) {
		article {
			flex-direction: row;
		}

		.right {
			min-width: 20rem;
		}
	}
</style>
