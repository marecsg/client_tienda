import { CanActivateFn, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
   return authService.isLoggedIn$.pipe(
    take(2),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']);
        return false; 
      }
    })
  );
};
