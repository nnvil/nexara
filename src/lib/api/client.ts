import env from "$lib/env";
import type { ApiResponse } from "$lib/types/api";

const API_BASE = `${env.api}`;

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
}

export class ApiError extends Error {
    constructor(
        public message: string,
        public code: string,
        public errorId: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
        });

        const text = await response.text();
        if (!text && response.ok) {
            return {} as T;
        }

        let data: ApiResponse<T>;
        try {
            data = text
                ? JSON.parse(text)
                : {
                      error: "Pusta odpowiedź serwera",
                      code: 500,
                      id: "empty-response",
                  };
        } catch (e) {
            throw new ApiError(
                "Błąd podczas przetwarzania odpowiedzi serwera",
                "500",
                "parse-error"
            );
        }

        if (!response.ok) {
            throw new ApiError(
                data.error || "Wystąpił nieznany błąd",
                data.code?.toString() || "500",
                data.id || "unknown"
            );
        }

        return data.data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            "Nie można połączyć się z serwerem",
            "500",
            "connection-error"
        );
    }
}

export const api = {
    get: <T>(endpoint: string, options: RequestOptions = {}) =>
        apiRequest<T>(endpoint, options),
    post: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, { method: "POST", body }),
    put: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, { method: "PUT", body }),
    delete: <T>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: "DELETE" }),
    patch: <T>(endpoint: string, body: unknown) =>
        apiRequest<T>(endpoint, { method: "PATCH", body }),
};
