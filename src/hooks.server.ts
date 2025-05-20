import { clearAuthCookies, validateTokens } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

const protectedRoutes = ["/account"];
const authRoutes = ["/login", "/register"];

export const handle: Handle = async ({ event, resolve }) => {
    const path = event.url.pathname;

    const isAuthenticated = await validateTokens(event.cookies, event.fetch);
    event.locals.isAuthenticated = isAuthenticated;

    if (protectedRoutes.some((route) => path.startsWith(route))) {
        if (!isAuthenticated) {
            clearAuthCookies(event.cookies);
            return new Response("Redirect", {
                status: 303,
                headers: { Location: "/login" },
            });
        }
    }

    if (authRoutes.some((route) => path.startsWith(route))) {
        if (isAuthenticated) {
            return new Response("Redirect", {
                status: 303,
                headers: { Location: "/account" },
            });
        }
    }

    const response = await resolve(event);
    return response;
};
