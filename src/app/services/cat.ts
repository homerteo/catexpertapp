import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class Cat {
  private http = inject(HttpClient);
  private envService = inject(Environment);

}
