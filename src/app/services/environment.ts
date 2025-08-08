import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Environment {

  get apiKey(): string {
    return environment.API_KEY;
  }

  get apiUrl(): string {
    return environment.API_URL;
  }

  get isProduction(): boolean {
    return environment.production;
  }

  getFullApiUrl(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

}
