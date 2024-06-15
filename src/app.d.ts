import PocketBase from 'pocketbase';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			error: string;
			message: string;
		}
		interface Locals {
			pocketBase: PocketBase;
			pocketBaseAdmin: PocketBase;
		}

		type LoadFetch = (
			input: URL | RequestInfo,
			init?: RequestInit | undefined
		) => Promise<Response>;
	}
}

export {};
