import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { clearAuthCookies } from "$lib/server/auth";

export const load: PageServerLoad = async ({ cookies, locals }) => {
    clearAuthCookies(cookies);

    locals.isAuthenticated = false;

    throw redirect(303, "/login");
};
