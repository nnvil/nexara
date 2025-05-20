export interface ApiError {
    message: string;
    code?: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    code?: number;
    id?: string;
}

export interface User {
    id: number;
    username: string;
    avatarUrl?: string;
    createdAt?: string;
    email?: string;
    isAdmin?: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    inviteCode: string;
}

export interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
    inviteCode?: string;
}
