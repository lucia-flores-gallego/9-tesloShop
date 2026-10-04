import { Routes } from '@angular/router';
import { AuthLayout } from '@/auth/layout/authLayout/authLayout';
import { LoginPage } from './pages/loginPage/loginPage';
import { RegisterPage } from './pages/registerPage/registerPage';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
      {
        path: '**',
        redirectTo: 'login',
        //pathMatch: 'full',
      },
    ],
  },
];

export default authRoutes;