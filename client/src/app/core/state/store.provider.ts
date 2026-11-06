import { Provider, APP_INITIALIZER, inject } from '@angular/core';
import {
  signal,
  computed,
  Signal,
  WritableSignal,
  ReadonlySignal,
} from '@angular/core';

export interface AppState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  sidebarExpanded: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatarUrl?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

const initialState: AppState = {
  isAuthenticated: false,
  currentUser: null,
  sidebarExpanded: true,
  theme: 'light',
  notifications: [],
};

export class AppStore {
  private readonly state: WritableSignal<AppState> = signal<AppState>(initialState);

  readonly isAuthenticated: ReadonlySignal<boolean> = computed(
    () => this.state().isAuthenticated
  );

  readonly currentUser: ReadonlySignal<UserProfile | null> = computed(
    () => this.state().currentUser
  );

  readonly sidebarExpanded: ReadonlySignal<boolean> = computed(
    () => this.state().sidebarExpanded
  );

  readonly theme: ReadonlySignal<'light' | 'dark'> = computed(
    () => this.state().theme
  );

  readonly notifications: ReadonlySignal<Notification[]> = computed(
    () => this.state().notifications
  );

  readonly unreadNotifications: ReadonlySignal<number> = computed(
    () => this.state().notifications.filter((n) => !n.read).length
  );

  getState(): AppState {
    return this.state();
  }

  setAuthenticated(user: UserProfile): void {
    this.state.update((s) => ({
      ...s,
      isAuthenticated: true,
      currentUser: user,
    }));
  }

  logout(): void {
    this.state.update((s) => ({
      ...s,
      isAuthenticated: false,
      currentUser: null,
    }));
  }

  toggleSidebar(): void {
    this.state.update((s) => ({
      ...s,
      sidebarExpanded: !s.sidebarExpanded,
    }));
  }

  setSidebarExpanded(expanded: boolean): void {
    this.state.update((s) => ({
      ...s,
      sidebarExpanded: expanded,
    }));
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.state.update((s) => ({ ...s, theme }));
    if (typeof document !== 'undefined') {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${theme}-theme`);
    }
  }

  toggleTheme(): void {
    const current = this.state().theme;
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    this.state.update((s) => ({
      ...s,
      notifications: [newNotification, ...s.notifications].slice(0, 50),
    }));
  }

  markNotificationRead(id: string): void {
    this.state.update((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }

  markAllNotificationsRead(): void {
    this.state.update((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }

  clearNotifications(): void {
    this.state.update((s) => ({
      ...s,
      notifications: [],
    }));
  }

  reset(): void {
    this.state.set(initialState);
  }
}

const appStore = new AppStore();

export function storeProvider(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      return () => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          appStore.setTheme(savedTheme);
        }
        const savedSidebar = localStorage.getItem('sidebar-expanded');
        if (savedSidebar !== null) {
          appStore.setSidebarExpanded(savedSidebar === 'true');
        }
      };
    },
    multi: true,
  };
}

export function useAppStore(): AppStore {
  return appStore;
}

export { appStore };