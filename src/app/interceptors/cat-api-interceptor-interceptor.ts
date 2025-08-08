import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Environment } from '../services/environment';

export const catApiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const envService = inject(Environment);

  if(req.url.includes(envService.apiUrl)) {
    const head = req.clone({
      setHeaders: {
        "Content-Type": "application/json",
        'x-api-key': envService.apiKey
      }
    })
    return next(head);
  }
  return next(req);
};
