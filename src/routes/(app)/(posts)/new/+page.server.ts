import { PostCreateSchema, isValidUser } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.pocketBase.authStore.isValid || !isValidUser(locals.pocketBase.authStore.model)) {
		throw redirect(303, '/auth');
	}
	return {};
};

export const actions = {
	newPost: async ({ locals, request }) => {
		const authModel = locals.pocketBase.authStore.model;
		if (!locals.pocketBase.authStore.isValid || !isValidUser(authModel)) {
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
				user: authModel.id
			});

      if (record.id) {
        throw redirect(303, `/posts/${record.id}`);
      }
  
      throw redirect(303, '/');
      
		} catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return {
          message: error.message,
        };
      }

      return {
        message: "An error occurred while uploading code snippet.",
      };
		}
	}
};
