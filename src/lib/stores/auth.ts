import { writable } from "svelte/store";

export const isAuthenticated = writable<boolean>(false);

export function initAuth(initialValue: boolean) {
    isAuthenticated.set(initialValue);
}
