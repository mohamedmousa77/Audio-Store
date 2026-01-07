import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseApiServices {
  protected readonly baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}


  protected getStandardHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  protected buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }
}
