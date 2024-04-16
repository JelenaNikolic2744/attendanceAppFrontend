import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwt = authService.getJwt();

  if (jwt) {
    return true;
  }
  return router.parseUrl('/login');
};
