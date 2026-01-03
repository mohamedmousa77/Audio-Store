import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
//   {
//     path: 'dashboard',
//     loadComponent: () => import('./dashboard/dashboard-page.component').then(m => m.DashboardPageComponent)
//   },
//   {
//     path: 'products',
//     loadComponent: () => import('./products-manage/products-page.component').then(m => m.ProductsPageComponent)
//   },
//   {
//     path: 'orders',
//     loadComponent: () => import('./orders-manage/orders-page.component').then(m => m.OrdersPageComponent)
//   },
//   {
//     path: 'customers',
//     loadComponent: () => import('./customers-manage/customers-page.component').then(m => m.CustomersPageComponent)
//   },
//   {
//     path: 'categories',
//     loadComponent: () => import('./categories-manage/categories-page.component').then(m => m.CategoriesPageComponent)
//   },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
