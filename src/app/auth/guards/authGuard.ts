import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';

import { AuthService } from '@/auth/services/authService';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkStatus().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/auth/login');
      }
    }),
    map((isAuthenticated) => isAuthenticated)
  );
};

export const publicGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkStatus().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigateByUrl('/');
        return false;
      }

      return true;
    })
  );
};