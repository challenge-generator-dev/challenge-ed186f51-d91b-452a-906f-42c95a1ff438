import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { routerTransitionProvider } from './core/animations/router-transition.provider';
import { storeProvider } from './core/state/store.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
      }),
      routerTransitionProvider
    ),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    storeProvider,
  ],
};