import {
	PRIVATE_POCKETBASE_URL,
	PRIVATE_POCKETBASE_EMAIL,
	PRIVATE_POCKETBASE_PASSWORD
} from '$env/static/private';

import { pb } from '$lib/pocketbase';
import { fail } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle = async ({ event, resolve }) => {
	event.locals.pocketBase = new PocketBase(PRIVATE_POCKETBASE_URL);

	const cookie = event.request.headers.get('cookie');
	event.locals.pocketBase.authStore.loadFromCookie(cookie || '');

	try {
		if (event.locals.pocketBase.authStore.isValid) {
			await event.locals.pocketBase.collection('users').authRefresh();
		}
	} catch (_) {
		event.locals.pocketBase.authStore.clear();
	}

	event.locals.pocketBaseAdmin = new PocketBase(PRIVATE_POCKETBASE_URL);

	try {
		await event.locals.pocketBaseAdmin.admins.authWithPassword(
			PRIVATE_POCKETBASE_EMAIL,
			PRIVATE_POCKETBASE_PASSWORD
		);
	} catch (error) {
		throw fail(401, { error: 'Invalid credentials' });
	}

	pb.set(event.locals.pocketBase);

	const response = await resolve(event);

	response.headers.set(
		'set-cookie',
		event.locals.pocketBase.authStore.exportToCookie({
			sameSite: true,
			secure: false,
			httpOnly: false
		})
	);

	return response;
};
