import { isValidUser } from "$lib/types.js";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
  if (
    !locals.pocketBase.authStore.isValid ||
    !isValidUser(locals.pocketBase.authStore.model)
  ) {
    throw redirect(303, "/auth");
  }

  throw redirect(303, `/profiles/${locals.pocketBase.authStore.model.id}`);
});