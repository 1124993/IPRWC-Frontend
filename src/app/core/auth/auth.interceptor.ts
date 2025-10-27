import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('auth.jwt');
    if (!token) return next(req);

    // only attach to our API calls
    if (!req.url.startsWith('/api/')) return next(req);

    const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
};
