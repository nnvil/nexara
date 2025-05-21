import type { RegisterCredentials, User } from "$lib/types/api";
import { api } from "./client";

export async function login(
    usernameOrEmail: string,
    password: string
): Promise<User> {
    return api.post("/login", { usernameOrEmail, password });
}

export async function register(
    username: string,
    email: string,
    password: string,
    inviteCode: string
): Promise<void> {
    const validationErrors = validateRegistrationData({
        username,
        email,
        password,
        inviteCode,
    });
    if (validationErrors) {
        throw new Error(Object.values(validationErrors)[0]);
    }
    return api.post("/register", { username, email, password, inviteCode });
}

export async function logout(): Promise<void> {
    document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    window.location.reload();
    window.location.href = "/login";
}

export function hasAuthCookies(): boolean {
    if (typeof document === "undefined") return false;
    return (
        document.cookie.includes("access=") &&
        document.cookie.includes("refresh=")
    );
}

export async function checkAuth(): Promise<boolean> {
    try {
        await api.get("/users/me");
        return true;
    } catch (error) {
        return false;
    }
}

export function validateUsername(username: string): string | undefined {
    if (username.length < 4 || username.length > 16) {
        return "Nazwa użytkownika musi mieć od 4 do 16 znaków";
    }
    if (!/^[a-zA-Z0-9]*$/.test(username)) {
        return "Nazwa użytkownika może zawierać tylko litery i cyfry";
    }
    return undefined;
}

export function validatePassword(password: string): string | undefined {
    if (password.length < 8 || password.length > 2048) {
        return "Hasło musi mieć od 8 do 2048 znaków";
    }
    const digitCount = (password.match(/\d/g) || []).length;
    const hasSpecial = /[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?\/\\`~]/.test(password);

    if (digitCount < 3) {
        return "Hasło musi zawierać co najmniej 3 cyfry";
    }
    if (!hasSpecial) {
        return "Hasło musi zawierać co najmniej jeden znak specjalny";
    }
    return undefined;
}

export function validateEmail(email: string): string | undefined {
    if (!email || !email.includes("@")) {
        return "Nieprawidłowy adres email";
    }
    const [userPart, domainPart] = email.split("@");

    if (userPart.length > 64 || domainPart.length > 255) {
        return "Nieprawidłowa długość adresu email";
    }

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(userPart)) {
        return "Nieprawidłowy format części lokalnej adresu email";
    }

    if (
        !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            domainPart
        )
    ) {
        return "Nieprawidłowy format domeny email";
    }

    return undefined;
}

export function validateRegistrationData(
    data: RegisterCredentials
): Record<string, string> | null {
    const errors: Record<string, string> = {};

    const usernameError = validateUsername(data.username);
    if (usernameError) errors.username = usernameError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    if (!data.inviteCode || data.inviteCode.trim() === "") {
        errors.inviteCode = "Kod zaproszenia jest wymagany";
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<void> {
    const validationErrors = validatePassword(newPassword);
    if (validationErrors) {
        throw new Error(Object.values(validationErrors)[0]);
    }
    return api.patch("/users/me/password", { currentPassword, newPassword });
}

export async function changeEmail(
    newEmail: string,
    password: string
): Promise<void> {
    return api.patch("/users/me/email", { newEmail, password });
}
