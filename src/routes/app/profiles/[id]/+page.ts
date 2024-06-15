import { redirect } from '@sveltejs/kit';

export const load = async ({ route, params }) => {
	const path = route.id.replace('/app', '').replace('[id]', params.id);
	throw redirect(303, path);
};
