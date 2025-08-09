import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginCredentials, User } from '../interfaces/user.interface';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Users {
  private router = inject(Router);

  // Estados signal
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _authError = signal<string | null>(null);
  private _users = signal<User[]>([]);

  // Signals públicos
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly authError = this._authError.asReadonly();

   private mockUsers: User[] = [
    {
      id: '1',
      email: 'mateo@catapp.com',
      firstName: 'Mateo',
      lastName: 'Ramirez',
      isActive: true
    },
  ]

  constructor() {
    this._users.set([...this.mockUsers]);
    this.checkLocalStorageUser();
  }

  private checkLocalStorageUser(): void {
    const localStorageUser = localStorage.getItem('currentUser');
    const localStorageToken = localStorage.getItem('token');

    if(localStorageUser && localStorageToken) {
      try {
        const user = JSON.parse(localStorageUser);
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
      } catch (error) {
        this.logout()
      }
    }
  }

  login(loginData: LoginCredentials): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._authError.set(null);

    return new Observable<AuthResponse>(o => {
      try {
        const user = this._users().find(u => u.email === loginData.email);

        if(!user) {
          this._authError.set('Usuario o contraseña errónea');
          o.next({ success: false, message: 'Usuario o contraseña errónea'});
          o.complete();
        }

        if(loginData.password !== '1234') {
          this._authError.set('Usuario o contraseña errónea');
          o.next({ success: false, message: 'Usuario o contraseña errónea'});
        }

        this._currentUser.set(user!);
        this._isAuthenticated.set(true);
        const token = '1234';

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', token);

        o.next({
          success:true,
          user,
          token,
          message: 'Ingreso exitoso'
        });
        o.complete();
      } catch (error) {
        this._authError.set('Error al intentar loguear');
        o.next({ success: false, message: 'Error al intentar loguear'});
        o.complete()
      } finally {
        this._isLoading.set(false);
      }
    })
  }

  logout(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._authError.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['login']);
  }

}
