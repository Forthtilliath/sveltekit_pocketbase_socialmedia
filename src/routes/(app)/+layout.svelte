<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { pb } from '$lib/pocketbase';

	export let data;

	$: photo =
		$pb && data.authenticated && data.authModel.photo
			? $pb.files.getUrl(data.authModel, data.authModel.photo)
			: null;
</script>

<div class="main">
	<aside>
		<div class="top">
			<a href="/">
				<h1 class="md-show">CodeShare</h1>
				<h1 class="md-hide">CS</h1>
			</a>

			<hr />

			<section class="links">
				<Link href="/" variant="ghost" align="left">
					<div class="link-content">
						<iconify-icon icon="octicon:home-fill-24" />
						<span> Home </span>
					</div>
				</Link>

				{#if data.authenticated}
					<Link href="/profiles" variant="ghost" align="left">
						<div class="link-content">
							{#if photo}
								<img src={photo} alt={data.authModel.name} />
							{:else}
								<iconify-icon icon="ic:baseline-account-circle" />
							{/if}
							<span> Profile </span>
						</div>
					</Link>

					<Link href="/settings" variant="ghost">
						<div class="link-content">
							<iconify-icon icon="material-symbols:settings" />
							<span> Settings </span>
						</div>
					</Link>
				{/if}
			</section>

			<section class="links icons">
				<Link href="/" variant="ghost" size="icon">
					<iconify-icon icon="octicon:home-fill-24" />
				</Link>

				{#if data.authenticated}
					<Link href="/profiles" variant="ghost" size="icon">
						<iconify-icon icon="ic:baseline-account-circle" />
					</Link>

					<Link href="/settings" variant="ghost" size="icon">
						<iconify-icon icon="material-symbols:settings" />
					</Link>
				{/if}
			</section>
		</div>

		<div class="links">
			{#if data.authenticated}
				<Link href="/new" variant="primary" size="large">
					<div class="link-content create">
						<iconify-icon icon="mingcute:add-fill" />
						<span> Create </span>
					</div>
				</Link>
			{:else}
				<Link href="/auth/login" variant="primary" size="large">Log in</Link>
				<Link href="/auth/register" variant="primary" size="large">Create an account</Link>
			{/if}
		</div>

		<div class="links icons">
			{#if data.authenticated}
				<Link href="/new" variant="primary" size="icon">
					<iconify-icon icon="mingcute:add-fill" />
				</Link>
			{:else}
				<Link href="/settings" size="icon" variant="primary">
					<iconify-icon icon="mdi:login" />
				</Link>
			{/if}
		</div>
	</aside>

	<main>
		<slot />
	</main>
</div>

<style>
	.main {
		display: flex;
		background-color: var(--secondary-color);
		flex-grow: 1;
		overflow: hidden;
	}

	aside {
		background-color: var(--primary-color);
		border-right: solid 1px var(--tertiary-color);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		padding: 1rem;
		overflow: auto;
	}

	hr {
		border: none;
		border-top: solid 1px var(--tertiary-color);
	}

	.top > a {
		text-decoration: none;
		display: grid;
		place-items: center;
	}

	.top {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	aside h1 {
		color: var(--accent-color);
		font-size: 24px;
	}

	main {
		overflow: auto;
		height: 100vh;
		flex-grow: 1;
	}

	.md-show {
		display: none;
	}

	.md-hide {
		display: block;
	}

	.links {
		display: none;
		flex-direction: column;
		gap: 8px;
	}

	.link-content {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	iconify-icon {
		font-size: 22px;
	}

	img {
		width: 22px;
		height: 22px;
		object-fit: cover;
	}

	.link-content span {
		font-size: 14px;
	}

	.link-content.create {
		justify-content: center;
	}

	.link-content.create iconify-icon {
		font-size: 16px;
		color: var(--text-color);
	}

	.link-content.create span {
		color: var(--text-color);
	}

	.icons {
		display: flex;
	}

	@media (min-width: 800px) {
		aside {
			min-width: 10rem;
			align-items: unset;
		}

		.md-show {
			display: block;
		}

		.md-hide {
			display: none;
		}

		.links {
			display: flex;
		}

		.icons {
			display: none;
		}
	}
</style>
