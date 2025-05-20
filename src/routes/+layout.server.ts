import env from "$lib/env";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, fetch, depends }) => {
    depends("app:auth");
    let user = null;

    if (locals.isAuthenticated) {
        try {
            const response = await fetch(`${env.api}/users/me`);
            if (response.ok) {
                user = await response.json();
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return {
        isAuthenticated: locals.isAuthenticated,
        user: user,
    };
};
