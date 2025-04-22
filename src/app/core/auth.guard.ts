import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['rol'];
    const user = this.authService.getUser();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (expectedRole && user.rol !== expectedRole) {
      this.router.navigate(['/home']); 
      return false;
    }

    return true;
  }
}
