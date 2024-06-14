import PocketBase from 'pocketbase';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pocketBase: PocketBase;
			pocketBaseAdmin: PocketBase;
		}

		type LoadFetch = (
			input: URL | RequestInfo,
			init?: RequestInit | undefined
		) => Promise<Response>;
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
