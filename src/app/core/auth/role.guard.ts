import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService }
from './auth-service';

export const roleGuard:
CanActivateFn = (route) => {

  const auth =
    inject(AuthService);

  const router =
    inject(Router);

  const allowedRoles =
    route.data['roles'];

  const currentRole =
    auth.getRole();

  if (
    allowedRoles.includes(
      currentRole
    )
  ) {

    return true;

  }

  router.navigate([
    '/dashboard'
  ]);

  return false;

};