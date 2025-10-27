import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Normalize the API base once (strip trailing slash)
const apiBase = (environment.apiUrl || '').replace(/\/+$/, '');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('auth.jwt');
    if (!token) return next(req);

    // We must handle BOTH cases:
    //  1) Relative URLs before rewrite:              "/api/..."
    //  2) Absolute URLs after apiBaseInterceptor:    "https://.../api/..."
    const url = req.url;
    const isRelativeApi = url.startsWith('/api/');
    const isAbsoluteApi = apiBase && (url.startsWith(`${apiBase}/api/`) || url.startsWith(`${apiBase}/`));

    if (!(isRelativeApi || isAbsoluteApi)) {
        // Not our API → don't attach Authorization
        return next(req);
    }

    return next(
        req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        })
    );
};
