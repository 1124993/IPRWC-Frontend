export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export type AppRole = 'ADMIN' | 'USER' | 'ANONYMOUS';

export interface MeResponse {
    email: string;
    role: AppRole;
}
