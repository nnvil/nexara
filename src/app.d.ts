// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            isAuthenticated: boolean;
        }
        interface PageData {
            isAuthenticated: boolean;
            user?: User;
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
