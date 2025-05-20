import { writable } from "svelte/store";
import type { User } from "$lib/types/api";

export interface AuthenticatedUser extends User {
    isAuthenticated: boolean;
}

const createUserStore = () => {
    const { subscribe, set, update } = writable<AuthenticatedUser | null>(null);

    return {
        subscribe,
        set,
        update,
        reset: () => set(null),
    };
};

export const user = createUserStore();
