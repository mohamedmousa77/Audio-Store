import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
export const routes: Routes = [
  // Homepage Route
  {
    path: '',
    pathMatch: 'full', // Assicura che corrisponda esattamente alla root (/)
    loadComponent: () =>
      import('./features/Client/homepage/home-page/homepage').then(
        m => m.Homepage
      )
  },
  
  // Auth Routes
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
  
  // Admin Routes
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
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders-manage/orders-page/orders-page')
            .then(m => m.OrdersPage)
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/admin/customers-manage/customers-page/customers-page')
            .then(m => m.CustomersPage)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories-manage/categories-page/categories-page')
            .then(m => m.CategoriesPage)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  // Client Routes 
  {
    path: '',
    loadComponent: () =>
      import('./features/Client/homepage/home-page/homepage').then(
        m => m.Homepage
      )
  },
  {
    path: 'category/:id',
    loadComponent: () =>
      import('./features/Client/category-products/category-products-page/category-products-page').then(
        m => m.CategoryProductsPage
      )
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/Client/product-details/product-details-page/product-details').then(
        m => m.ProductDetails
      )
  },
  // Wildcard route - 404
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
