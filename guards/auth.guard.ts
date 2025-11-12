// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Verificar roles se necessário
      const expectedRole = route.data['expectedRole'];
      if (expectedRole) {
        const user = this.authService.currentUserValue;
        if (user && user.role !== expectedRole) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: route.url } });
    return false;
  }
}