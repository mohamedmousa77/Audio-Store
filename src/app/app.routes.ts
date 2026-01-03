import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'admin/dashboard', 
        pathMatch: 'full' 
    },
    {
    path: 'admin',
    children: [
            {
                path: 'login',
                loadComponent: () => import('./features/admin/login/admin-login.component/admin-login.component')
                .then(m => m.AdminLoginComponent)
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/dashboard/dashboard')
                .then(m => m.Dashboard), canActivate: [authGuard, adminGuard]
            },
            {
                path: '',
                redirectTo: '/admin/dashboard',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: '/admin/dashboard'
            }
        ]
    }
];
