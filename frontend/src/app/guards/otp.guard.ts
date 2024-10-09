import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const otpGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService)
  const router = inject(Router)
  if (userService.getOtpCode()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
