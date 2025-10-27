import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { RoleGuard } from './core/auth/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },

    {
        path: 'products',
        loadComponent: () =>
            import('./features/catalog/products-list/products-list.component')
                .then(m => m.ProductsListComponent),
    },
    {
        path: 'products/:id',
        loadComponent: () =>
            import('./features/catalog/product-detail/product-detail.component')
                .then(m => m.ProductDetailComponent),
    },

    {
        path: 'cart',
        canActivate: [AuthGuard, RoleGuard('USER')], // USER only
        loadComponent: () =>
            import('./features/cart/cart-page/cart-page.component')
                .then(m => m.CartPageComponent),
    },

    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login-page/login-page.component')
                .then(m => m.LoginPageComponent),
    },

    {
        path: 'signup',
        loadComponent: () =>
            import('./features/auth/signup-page/signup-page.component')
                .then(m => m.SignUpPageComponent),
    },

    {
        path: 'admin',
        canActivate: [AuthGuard, RoleGuard('ADMIN')],
        loadComponent: () =>
            import('./features/admin/admin-home/admin-home.component')
                .then(m => m.AdminHomeComponent),
    },
    {
        path: 'admin/products',
        canActivate: [AuthGuard, RoleGuard('ADMIN')],
        loadComponent: () =>
            import('./features/admin/admin-products-page/admin-products-page.component')
                .then(m => m.AdminProductsPageComponent),
    },
    {
        path: 'admin/orders',
        canActivate: [AuthGuard, RoleGuard('ADMIN')],
        loadComponent: () =>
            import('./features/admin/admin-orders-page/admin-orders-page.component')
                .then(m => m.AdminOrdersPageComponent),
    },

    {
        path: 'orders',
        canActivate: [AuthGuard], // or [AuthGuard, RoleGuard('USER')] if you prefer
        loadComponent: () =>
            import('./features/orders/orders-page/orders-page.component')
                .then(m => m.OrdersPageComponent),
    },
    {
        path: 'orders/:id',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./features/orders/order-lines-page/order-lines-page.component')
                .then(m => m.OrderLinesPageComponent),
    },

    { path: '**', redirectTo: 'products' },
];
