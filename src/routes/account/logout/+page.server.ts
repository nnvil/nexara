import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, locals }) => {
    cookies.delete("access", { path: "/" });
    cookies.delete("refresh", { path: "/" });

    locals.isAuthenticated = false;

    throw redirect(303, "/login");
};
