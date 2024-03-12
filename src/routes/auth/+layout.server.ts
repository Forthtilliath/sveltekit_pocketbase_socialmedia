import { redirect } from '@sveltejs/kit';

export const load = async({locals}) => {
  if(locals.pocketBase.authStore.isValid) {
    throw redirect(303, '/');
  }

  return {}
}