import { UserCreateSchema } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals, request }) => {
		if (locals.pocketBase.authStore.isValid) {
			throw redirect(303, '/');
		}
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			const formDataParsed = UserCreateSchema.safeParse(data);

			if (!formDataParsed.success) {
				throw new Error(formDataParsed.error.errors[0].message);
			}

			const { name, email, password } = formDataParsed.data;

			const userWithNameExists = await locals.pocketBase
				.collection('users')
				.getFirstListItem(`name="${name}"`)
				.catch(() => null);

			if (userWithNameExists) {
				throw new Error('Name is already taken');
			}

			await locals.pocketBaseAdmin.collection('users').create({
				name,
				email,
				password,
				passwordConfirm: password,
				emailVisibility: false
			});

			await locals.pocketBase.collection('users').authWithPassword(email, password);
		} catch (error) {
			const fields = {
				name: typeof data.name !== 'string' ? '' : data.name,
				email: typeof data.email !== 'string' ? '' : data.email,
				password: typeof data.password !== 'string' ? '' : data.password
			};

			if (error instanceof Error) {
				return { ...fields, error: error.message };
			}
			return { ...fields, error: 'Something went wrong' };
		}

		throw redirect(303, '/');
	}
};
