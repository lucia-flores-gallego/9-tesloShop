import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '@/auth/guards/authGuard';

export const routes: Routes = [
  {
    path: 'auth',
    canMatch: [publicGuard],
    loadChildren: () => import('@/auth/authRoutes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
  },
  {
    path: '',
    loadChildren: () => import('@/store-front/store-front.routes'),
  },
];