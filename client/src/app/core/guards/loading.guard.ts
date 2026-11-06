import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable, of, BehaviorSubject, combineLatest, map, takeUntil, Subject, timer } from 'rxjs';
import { ApiClientService } from '../../shared/services/api-client.service';

interface LoadingState {
  isLoading: boolean;
  pendingRequests: number;
  loadingMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingGuard implements CanActivate, CanActivateChild, OnDestroy {
  private readonly router = inject(Router);
  private readonly apiClient = inject(ApiClientService);
  
  private readonly loadingState = signal<LoadingState>({
    isLoading: false,
    pendingRequests: 0,
    loadingMessage: undefined
  });
  
  private readonly minimumLoadingTime = 300;
  private readonly destroy$ = new Subject<void>();
  private loadingStartTime = 0;
  private pendingGuards: Map<string, Observable<boolean | UrlTree>> = new Map();

  readonly isLoading = computed(() => this.loadingState().isLoading);
  readonly pendingRequests = computed(() => this.loadingState().pendingRequests);
  readonly loadingMessage = computed(() => this.loadingState().loadingMessage);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const guardId = `canActivate_${state.url}`;
    return this.executeWithLoading(guardId, of(true));
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const guardId = `canActivateChild_${state.url}`;
    return this.executeWithLoading(guardId, of(true));
  }

  private executeWithLoading<T>(guardId: string, guardResult: Observable<T>): Observable<T> {
    this.startLoading(`Verifying access to ${guardId}`);
    
    const resultWithMinTime = guardResult.pipe(
      takeUntil(this.destroy$)
    );

    const elapsedTime = timer(this.minimumLoadingTime).pipe(
      takeUntil(this.destroy$)
    );

    return combineLatest([resultWithMinTime, elapsedTime]).pipe(
      map(([result]) => {
        this.stopLoading();
        return result;
      }),
      takeUntil(this.destroy$)
    );
  }

  private startLoading(message: string): void {
    this.loadingStartTime = Date.now();
    this.loadingState.update(state => ({
      ...state,
      isLoading: true,
      pendingRequests: state.pendingRequests + 1,
      loadingMessage: message
    }));
  }

  private stopLoading(): void {
    const elapsed = Date.now() - this.loadingStartTime;
    const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
    
    setTimeout(() => {
      this.loadingState.update(state => {
        const newPendingRequests = Math.max(0, state.pendingRequests - 1);
        return {
          ...state,
          isLoading: newPendingRequests > 0,
          pendingRequests: newPendingRequests,
          loadingMessage: newPendingRequests > 0 ? state.loadingMessage : undefined
        };
      });
    }, remainingTime);
  }

  forceCompleteLoading(): void {
    this.loadingState.set({
      isLoading: false,
      pendingRequests: 0,
      loadingMessage: undefined
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pendingGuards.clear();
  }
}

@Injectable({
  providedIn: 'root'
})
export class RouteLoadingState implements OnDestroy {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly messageSubject = new BehaviorSubject<string>('');
  private readonly destroy$ = new Subject<void>();

  readonly isLoading$ = this.loadingSubject.asObservable();
  readonly loadingMessage$ = this.messageSubject.asObservable();

  setLoading(isLoading: boolean, message: string = ''): void {
    this.loadingSubject.next(isLoading);
    this.messageSubject.next(message);
  }

  showLoading(message: string = 'Loading...'): void {
    this.setLoading(true, message);
  }

  hideLoading(): void {
    this.setLoading(false, '');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loadingSubject.complete();
    this.messageSubject.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class PreventMultipleNavigationGuard implements CanActivate {
  private readonly router = inject(Router);
  private isNavigating = false;
  private navigationQueue: Array<() => void> = [];

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isNavigating) {
      this.navigationQueue.push(() => {
        this.router.navigate([state.url]);
      });
      return false;
    }

    this.isNavigating = true;
    
    const result = true;
    
    setTimeout(() => {
      this.isNavigating = false;
      const next = this.navigationQueue.shift();
      if (next) next();
    }, 100);

    return result;
  }
}