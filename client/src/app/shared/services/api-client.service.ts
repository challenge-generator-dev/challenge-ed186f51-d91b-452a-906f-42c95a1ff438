import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { catchError, map, retry, shareReplay, finalize, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiRequestConfig {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: unknown;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  observe?: 'body' | 'response' | 'events';
  reportProgress?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpHeaders;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  error?: unknown;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new Subject<ApiError>();
  private readonly cancelSubject = new Subject<void>();

  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  get<T>(endpoint: string, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.get<T>(url, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body',
      reportProgress: config?.reportProgress || false
    }).pipe(
      retry({ count: 2, delay: 1000 }),
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject),
      shareReplay(1)
    );
  }

  post<T>(endpoint: string, body: unknown, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.post<T>(url, body, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body',
      reportProgress: config?.reportProgress || false
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject),
      shareReplay(1)
    );
  }

  put<T>(endpoint: string, body: unknown, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.put<T>(url, body, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body'
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject)
    );
  }

  patch<T>(endpoint: string, body: unknown, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.patch<T>(url, body, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body'
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject)
    );
  }

  delete<T>(endpoint: string, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.delete<T>(url, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body'
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject)
    );
  }

  getEventStream<T>(endpoint: string, headers?: Record<string, string>): Observable<T> {
    const url = this.buildUrl(endpoint);
    const eventHeaders = this.buildHeaders({
      ...headers,
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });

    return new Observable<T>(observer => {
      const eventSource = new EventSource(url, { headers: this.headersToPlainObject(eventHeaders) });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as T;
          observer.next(data);
        } catch (parseError) {
          console.warn('Error al parsear evento SSE:', parseError);
        }
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };

      eventSource.onopen = () => {
        console.log('Conexión SSE establecida con:', endpoint);
      };

      return () => {
        eventSource.close();
        console.log('Conexión SSE cerrada para:', endpoint);
      };
    });
  }

  cancelPendingRequests(): void {
    this.cancelSubject.next();
    this.cancelSubject.complete();
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    if (!params) return new HttpParams();
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  private buildHeaders(headers?: Record<string, string>): HttpHeaders {
    let resultHeaders = this.defaultHeaders;
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        resultHeaders = resultHeaders.set(key, value);
      });
    }
    return resultHeaders;
  }

  private extractData<T>(response: unknown, observe?: string): T {
    if (observe === 'response') {
      const apiResponse = response as { body: T };
      return apiResponse.body;
    }
    return response as T;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    let errorDetails: unknown;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de red: ${error.error.message}`;
      errorDetails = error.error;
    } else {
      errorMessage = error.error?.message || error.message || `Error HTTP ${error.status}: ${error.statusText}`;
      errorDetails = error.error;
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: error.status,
      statusText: error.statusText,
      error: errorDetails,
      timestamp: new Date().toISOString()
    };

    console.error('Error en API:', apiError);
    this.errorSubject.next(apiError);

    return throwError(() => apiError);
  }

  private headersToPlainObject(headers: HttpHeaders): Record<string, string> {
    const headersObj: Record<string, string> = {};
    headers.keys().forEach(key => {
      const value = headers.get(key);
      if (value) headersObj[key] = value;
    });
    return headersObj;
  }
}