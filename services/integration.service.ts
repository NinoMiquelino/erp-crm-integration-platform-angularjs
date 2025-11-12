// services/integration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiConfig {
  baseUrl: string;
  authType: 'oauth2' | 'api_key' | 'basic';
  authConfig: any;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  private apiConfigs: Map<string, ApiConfig> = new Map();

  constructor(private http: HttpClient) { }

  registerIntegration(name: string, config: ApiConfig): void {
    this.apiConfigs.set(name, config);
  }

  get<T>(integrationName: string, endpoint: string, params?: any): Observable<ApiResponse> {
    const config = this.apiConfigs.get(integrationName);
    if (!config) {
      return throwError(() => new Error(`Integration ${integrationName} not configured`));
    }

    const url = `${config.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(config);
    const httpParams = this.buildParams(params);

    return this.http.get<T>(url, { headers, params: httpParams }).pipe(
      map(data => this.formatSuccessResponse(data)),
      catchError(error => this.formatErrorResponse(error))
    );
  }

  post<T>(integrationName: string, endpoint: string, data: any): Observable<ApiResponse> {
    const config = this.apiConfigs.get(integrationName);
    if (!config) {
      return throwError(() => new Error(`Integration ${integrationName} not configured`));
    }

    const url = `${config.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(config);

    return this.http.post<T>(url, data, { headers }).pipe(
      map(response => this.formatSuccessResponse(response)),
      catchError(error => this.formatErrorResponse(error))
    );
  }

  put<T>(integrationName: string, endpoint: string, data: any): Observable<ApiResponse> {
    const config = this.apiConfigs.get(integrationName);
    if (!config) {
      return throwError(() => new Error(`Integration ${integrationName} not configured`));
    }

    const url = `${config.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(config);

    return this.http.put<T>(url, data, { headers }).pipe(
      map(response => this.formatSuccessResponse(response)),
      catchError(error => this.formatErrorResponse(error))
    );
  }

  delete<T>(integrationName: string, endpoint: string): Observable<ApiResponse> {
    const config = this.apiConfigs.get(integrationName);
    if (!config) {
      return throwError(() => new Error(`Integration ${integrationName} not configured`));
    }

    const url = `${config.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(config);

    return this.http.delete<T>(url, { headers }).pipe(
      map(response => this.formatSuccessResponse(response)),
      catchError(error => this.formatErrorResponse(error))
    );
  }

  private buildHeaders(config: ApiConfig): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    switch (config.authType) {
      case 'oauth2':
        const token = localStorage.getItem(`${config.authConfig.tokenKey}`);
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        break;
      case 'api_key':
        headers = headers.set(config.authConfig.headerName, config.authConfig.apiKey);
        break;
      case 'basic':
        const credentials = btoa(`${config.authConfig.username}:${config.authConfig.password}`);
        headers = headers.set('Authorization', `Basic ${credentials}`);
        break;
    }

    return headers;
  }

  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return httpParams;
  }

  private formatSuccessResponse(data: any): ApiResponse {
    return {
      success: true,
      data,
      timestamp: new Date()
    };
  }

  private formatErrorResponse(error: any): Observable<ApiResponse> {
    const errorResponse: ApiResponse = {
      success: false,
      error: error.message || 'Unknown error occurred',
      timestamp: new Date()
    };
    return throwError(() => errorResponse);
  }
}