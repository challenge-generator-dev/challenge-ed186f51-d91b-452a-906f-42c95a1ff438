import { Provider } from '@angular/core';
import {
  withInMemoryScrolling,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

const routeAnimationTrigger = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 1,
      }),
    ], { optional: true }),
    group([
      query(':leave', [
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateX(-20px)' })
        ),
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate(
          '300ms 100ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ], { optional: true }),
    ]),
  ]),
]);

const pageSlideAnimation = trigger('pageSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate(
      '250ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ opacity: 0, transform: 'translateY(-10px)' })
    ),
  ]),
]);

const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('200ms ease-in-out', style({ opacity: 1 })),
  ]),
]);

export const ROUTE_ANIMATION = routeAnimationTrigger;
export const PAGE_SLIDE_ANIMATION = pageSlideAnimation;
export const FADE_ANIMATION = fadeAnimation;

export function routerTransitionProvider(): typeof withInMemoryScrolling {
  return withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  });
}

export const ROUTE_TRANSITION_PROVIDER: Provider = {
  provide: 'ROUTER_TRANSITION_OPTIONS',
  useValue: {
    anchorScrolling: true,
    scrollPositionRestoration: 'enabled',
    animations: [routeAnimationTrigger, pageSlideAnimation, fadeAnimation],
  },
};