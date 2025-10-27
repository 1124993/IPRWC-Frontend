import { Injectable, signal, computed } from '@angular/core';

const KEY = 'auth.jwt';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
    private _token = signal<string | null>(localStorage.getItem(KEY));

    readonly token = computed(() => this._token());
    readonly isLoggedIn = computed(() => !!this._token());

    set(token: string) {
        localStorage.setItem(KEY, token);
        this._token.set(token);
    }

    clear() {
        localStorage.removeItem(KEY);
        this._token.set(null);
    }
}
