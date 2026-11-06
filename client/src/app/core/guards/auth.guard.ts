import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, map, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(state.url, route.data['requiredPermissions'], route.data['requiredRole']);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(state.url, childRoute.data['requiredPermissions'], childRoute.data['requiredRole']);
  }

  private checkAuth(
    url: string,
    requiredPermissions?: string | string[],
    requiredRole?: string
  ): Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        return of(this.createForbiddenTree(url));
      }

      if (requiredPermissions) {
        const permissions = Array.isArray(requiredPermissions) 
          ? requiredPermissions 
          : [requiredPermissions];
        
        const hasAllPermissions = permissions.every(
          permission => this.authService.hasPermission(permission)
        );

        if (!hasAllPermissions) {
          return of(this.createForbiddenTree(url));
        }
      }

      return of(true);
    }

    return of(this.createLoginTree(url));
  }

  private createLoginTree(returnUrl: string): UrlTree {
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl }
    });
  }

  private createForbiddenTree(returnUrl: string): UrlTree {
    return this.router.createUrlTree(['/forbidden'], {
      queryParams: { returnUrl }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    if (!this.authService.isAdmin()) {
      return this.router.createUrlTree(['/forbidden'], {
        queryParams: { returnUrl: state.url }
      });
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/dashboard']);
    }
    return true;
  }
}