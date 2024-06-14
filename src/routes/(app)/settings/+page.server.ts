import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { handleError } from '$lib/helpers';
import { isAuthenticated } from '$lib/db/auth';
import { assertsIsFile, assertsIsStringNotEmpty } from '$lib/asserts';

export const load = (async ({ locals }) => {
	if (!isAuthenticated(locals.pocketBase.authStore)) {
		throw redirect(303, '/auth');
	}

	return {
		authModel: locals.pocketBase.authStore.model
	};
}) satisfies PageServerLoad;

export const actions = {
	logout: async ({ locals }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		locals.pocketBase.authStore.clear();

		throw redirect(303, '/auth');
	},

	changeProfilePhoto: async ({ locals, request }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const photo = formData.get('photo');

		assertsIsFile(photo, 'Invalid photo');

		await locals.pocketBaseAdmin
			.collection('users')
			.update(locals.pocketBase.authStore.model.id, { photo })
			.catch(
				handleError('change-profile-photo', 'An error occurred while changing profile photo.')
			);

		throw redirect(303, '/settings');
	},

	removeProfilePhoto: async ({ locals }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		await locals.pocketBaseAdmin
			.collection('users')
			.update(locals.pocketBase.authStore.model.id, { photo: null })
			.catch(
				handleError('remove-profile-photo', 'An error occurred while removing profile photo.')
			);

		throw redirect(303, '/settings');
	},

	changeName: async ({ locals, request }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const name = formData.get('name');

		assertsIsStringNotEmpty(name, 'Invalid name');

		await locals.pocketBaseAdmin
			.collection('users')
			.update(locals.pocketBase.authStore.model.id, { name })
			.catch(handleError('change-name', 'An error occurred while changing name.'));

		throw redirect(303, '/settings');
	},

	changeEmail: async ({ locals, request }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const email = formData.get('email');

		assertsIsStringNotEmpty(email, 'Invalid email');

		await locals.pocketBaseAdmin
			.collection('users')
			.update(locals.pocketBase.authStore.model.id, { email })
			.catch(handleError('change-email', 'An error occurred while changing email.'));

		throw redirect(303, '/settings');
	},

	changeBio: async ({ locals, request }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const bio = formData.get('bio');

		assertsIsStringNotEmpty(bio, 'Invalid bio');

		await locals.pocketBaseAdmin
			.collection('users')
			.update(locals.pocketBase.authStore.model.id, { bio })
			.catch(handleError('change-bio', 'An error occurred while changing bio.'));

		throw redirect(303, '/settings');
	},

	deleteAccount: async ({ locals }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		await locals.pocketBaseAdmin
			.collection('users')
			.delete(locals.pocketBase.authStore.model.id)
			.catch(handleError('delete-account', 'An error occurred while deleting a user.'));

		locals.pocketBase.authStore.clear();

		throw redirect(303, '/auth');
	}
};
