import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../../layout/toast/toast.service';

export class RoleGuard {
  static checkRole(allowedRoles: string[]): CanActivateFn {
    return () => {
      const router = inject(Router);
      const toastService = inject(ToastService);
      const rawRole = localStorage.getItem('user_role') || '';
      const userRole = rawRole.toUpperCase().replace('ROLE_', '');

      if (allowedRoles.includes(userRole)) {
        return true;
      }

      toastService.showToast('error', 'Access Denied', 'Access Denied: Only Doctors and Admins can access this section.');
      router.navigate(['/dashboard']);
      return false;
    };
  }
}