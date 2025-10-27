import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiBaseInterceptor } from './core/api/api-base.interceptor';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      apiBaseInterceptor, // rewrites /api/... → environment.apiUrl + /api/...
      authInterceptor     // adds Authorization, etc.
    ])),
  ],
};
