import { PRIVATE_POCKETBASE_EMAIL, PRIVATE_POCKETBASE_PASSWORD } from '$env/static/private';

import { pb } from '$lib/pocketbase';
import { fail } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle = async ({ event, resolve }) => {
	event.locals.pocketBase = new PocketBase('http://localhost:8090');

	try {
		event.locals.pocketBase.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
		await event.locals.pocketBase.collection('users').authRefresh();
	} catch (error) {
		event.locals.pocketBase.authStore.clear();
	}

	event.locals.pocketBaseAdmin = new PocketBase('http://localhost:8090');

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
