export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiEndpoints: {
    orders: '/orders',
    orderEvents: '/orders/events',
    customers: '/customers',
    products: '/products',
    payments: '/payments'
  },
  sseConfig: {
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
    connectionTimeout: 10000
  },
  httpConfig: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    withCredentials: false,
    cacheEnabled: true,
    cacheMaxAge: 300000
  },
  features: {
    enableRealTimeUpdates: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableDebugMode: true,
    enableLogging: true
  },
  ui: {
    defaultPageSize: 10,
    maxPageSize: 100,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'USD',
    locale: 'es-ES',
    theme: 'indigo-pink',
    animationsEnabled: true,
    compactMode: false
  },
  pagination: {
    defaultPage: 1,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true
  },
  cache: {
    localStoragePrefix: 'app_',
    sessionStoragePrefix: 'session_',
    enablePersistence: true,
    maxCacheSize: 50
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false,
    remoteEndpoint: '',
    logLevels: {
      error: true,
      warn: true,
      info: true,
      debug: true,
      trace: false
    }
  },
  security: {
    enableCsrf: true,
    enableXssProtection: true,
    enableContentSecurityPolicy: true,
    allowedDomains: ['localhost:3000', 'localhost:4200']
  },
  websocket: {
    enabled: false,
    url: '',
    reconnectInterval: 5000
  }
};

export type Environment = typeof environment;