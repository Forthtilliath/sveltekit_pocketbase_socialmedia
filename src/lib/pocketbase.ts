import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';
import { PRIVATE_POCKETBASE_URL } from '$env/static/private';

export const pb = writable<PocketBase | undefined>(undefined, (set) => {
	if (!browser) return;

	const pocketbaseInstance = new PocketBase(PRIVATE_POCKETBASE_URL);
	pocketbaseInstance.authStore.loadFromCookie(document.cookie);

	set(pocketbaseInstance);
});
