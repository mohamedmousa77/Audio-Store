import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
export const routes: Routes = [
    {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  
  // Auth Routes (non protette)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => 
          import('./features/auth/login/login')
            .then(m => m.LoginForm)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  
  // Admin Routes (protette da guards)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard')
            .then(m => m.DashboardPageComponent)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products-manage/products-page/products-page')
            .then(m => m.ProductsPage)
      },
    //   {
    //     path: 'orders',
    //     loadComponent: () =>
    //       import('./features/admin/orders-manage/orders-page.component')
    //         .then(m => m.OrdersPageComponent)
    //   },
    //   {
    //     path: 'customers',
    //     loadComponent: () =>
    //       import('./features/admin/customers-manage/customers-page.component')
    //         .then(m => m.CustomersPageComponent)
    //   },
    //   {
    //     path: 'categories',
    //     loadComponent: () =>
    //       import('./features/admin/categories-manage/categories-page.component')
    //         .then(m => m.CategoriesPageComponent)
    //   },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // Wildcard route - 404
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
