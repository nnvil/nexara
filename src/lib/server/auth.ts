import env from "$lib/env";
import type { Cookies } from "@sveltejs/kit";

export async function validateTokens(
    cookies: Cookies,
    fetch: typeof globalThis.fetch
): Promise<boolean> {
    const accessToken = cookies.get("access");
    const refreshToken = cookies.get("refresh");

    if (!accessToken || !refreshToken) {
        return false;
    }

    try {
        const response = await fetch(`${env.api}/users/me`, {
            method: "GET",
            credentials: "include",
        });

        return response.ok;
    } catch {
        return false;
    }
}

export function clearAuthCookies(cookies: Cookies) {
    cookies.delete("access", { path: "/" });
    cookies.delete("refresh", { path: "/" });
}
