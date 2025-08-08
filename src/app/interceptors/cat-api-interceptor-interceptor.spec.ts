import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';
import { catApiInterceptorInterceptor } from './cat-api-interceptor-interceptor';
import { Environment } from '../services/environment';

@Injectable()
class EnvService {
  apiUrl = 'https://api.thecatapi.com/v1/';
  apiKey = 'api_key_123'
}

describe('catApiInterceptorInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let mockEnvService: EnvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([catApiInterceptorInterceptor])),
        provideHttpClientTesting(),
        { provide: Environment, useClass: EnvService }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    mockEnvService = TestBed.inject(Environment) as EnvService;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
      TestBed.runInInjectionContext(() => catApiInterceptorInterceptor(req, next));
    expect(interceptor).toBeTruthy();
  });

  it('Agrega la API_KEY al header a las peticiones que usan la API_URL', () => {
    const mockNextHandler: HttpHandler = {
      handle: jasmine.createSpy('handle').and.returnValue(of({}))
    };

    const request = new HttpRequest('GET', 'https://api.thecatapi.com/v1/images/search');

    TestBed.runInInjectionContext(() => {
      catApiInterceptorInterceptor(request, mockNextHandler.handle);
    });

    expect(mockNextHandler.handle).toHaveBeenCalled();

    const modifiedRequest = (mockNextHandler.handle as jasmine.Spy).calls.argsFor(0)[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.get('x-api-key')).toBe('api_key_123');
    expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
  });
});
