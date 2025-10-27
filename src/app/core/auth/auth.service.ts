import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of, shareReplay, switchMap } from 'rxjs';

export type AppRole = 'ADMIN' | 'USER' | 'ANONYMOUS';

interface LoginResponse { token: string; }
interface MeResponse { email: string; role: AppRole; }
interface SignupRequest { email: string; password: string; }

const TOKEN_KEY = 'auth.jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);

    // user state (null means "not loaded yet")
    readonly email = signal<string | null>(null);
    readonly role = signal<AppRole | null>(null);

    // ==== TOKEN HELPERS ====
    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    // ==== SIGN UP (register new USER account) ====
    /**
     * Calls POST /api/auth/signup
     * Body: { email, password }
     * Success: returns 201 Created with empty body
     * We return `true` when 201 is received; UI can then redirect to login.
     */
    signup(body: SignupRequest) {
        return this.http.post<void>('/api/auth/signup', body, { observe: 'response' }).pipe(
            map(res => {
                if (res.status === 201) {
                    return true; // ✅ signup succeeded
                } else {
                    throw new Error('Unexpected response status: ' + res.status);
                }
            })
        );
    }

    // ==== LOGIN ====
    /**
     * Calls POST /api/auth/login
     * Stores token on success, then immediately loads /api/auth/me
     * Returns true only after user role & email are ready.
     */
    login(body: { email: string; password: string }) {
        return this.http.post<LoginResponse>('/api/auth/login', body).pipe(
            switchMap(({ token }) => {
                localStorage.setItem(TOKEN_KEY, token);
                this._meOnce$ = undefined; // clear cached /me
                return this.me();          // load user info
            }),
            map(() => true)
        );
    }

    // ==== LOGOUT ====
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        this.email.set(null);
        this.role.set(null);
        this._meOnce$ = undefined;
    }

    // ==== LOAD CURRENT USER INFO ====
    /**
     * Calls GET /api/auth/me
     * Updates email() and role() signals
     */
    me() {
        return this.http.get<MeResponse>('/api/auth/me').pipe(
            map(res => {
                this.email.set(res.email);
                this.role.set(res.role);
                return res;
            }),
            shareReplay(1)
        );
    }

    // ==== ENSURE USER INFO IS LOADED (for guards) ====
    private _meOnce$?: ReturnType<AuthService['me']>;
    ensureMeLoaded() {
        if (this.role() !== null) {
            // already loaded in this session
            return of(true);
        }
        if (!this._meOnce$) {
            this._meOnce$ = this.me();
        }
        return this._meOnce$.pipe(map(() => true));
    }
}
