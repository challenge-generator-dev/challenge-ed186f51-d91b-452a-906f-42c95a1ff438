import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private ready = false;
  private initializationDelay = 500;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    timer(this.initializationDelay).subscribe(() => {
      this.ready = true;
    });
  }

  isReady(): Observable<boolean> {
    return of(this.ready).pipe(
      take(1)
    );
  }

  isLoading(): boolean {
    return !this.ready;
  }

  setReady(ready: boolean): void {
    this.ready = ready;
  }
}