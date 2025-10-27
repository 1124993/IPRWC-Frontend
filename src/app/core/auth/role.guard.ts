import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, AppRole } from './auth.service';
import { map } from 'rxjs';

/**
 * Guard factory: RoleGuard('ADMIN') or RoleGuard('USER')
 */
export function RoleGuard(required: AppRole): CanActivateFn {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        // no token? go to login and preserve target
        if (!auth.isAuthenticated()) {
            return router.createUrlTree(['/login'], { queryParams: { redirect: location.pathname } });
        }

        // wait until /me has populated the role, then decide
        return auth.ensureMeLoaded().pipe(
            map(() => {
                const role = auth.role();
                if (role === required) return true;
                // logged in but wrong role → send to store
                return router.createUrlTree(['/products']);
            })
        );
    };
}
