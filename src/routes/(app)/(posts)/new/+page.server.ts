import { isAuthenticated } from '$lib/db/auth.js';
import { handleError } from '$lib/helpers.js';
import { PostCreateSchema } from '$lib/types.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!isAuthenticated(locals.pocketBase.authStore)) {
		throw redirect(303, '/auth');
	}
	return {};
};

export const actions = {
	newPost: async ({ locals, request }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
			throw redirect(303, '/auth');
		}

		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			const formDataParsed = PostCreateSchema.safeParse(data);

			if (!formDataParsed.success) {
				throw new Error(formDataParsed.error.errors[0].message);
			}
			const { title, content, tags, language } = formDataParsed.data;

			const record = await locals.pocketBaseAdmin.collection('posts').create({
				title,
				content,
				tags,
				language,
				user: locals.pocketBase.authStore.model.id
			});

			if (record.id) {
				return {
					id: record.id
				};
			}

			throw fail(500, { error: 'An error occurred while creating the post.' });
		} catch (error) {
			handleError('new-post', 'An error occurred while uploading code snippet.')(error);
		}
	}
};
