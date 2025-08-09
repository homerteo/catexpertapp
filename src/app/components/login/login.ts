import { Component, inject, signal } from '@angular/core';
import { Users } from '../../services/users';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private userService = inject(Users);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly isLoading = this.userService.isLoading;
  readonly authError = this.userService.authError;
  readonly isAuthenticated = this.userService.isAuthenticated;

  private _submitting = signal(false);
  readonly submitting = this._submitting.asReadonly()

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  })

  constructor() {
    if(this.isAuthenticated()) {
      this.router.navigate(['/cats'])
    }
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if(this.loginForm.valid && !this.isLoading()) {
      this._submitting.set(true);
      const loginData: LoginCredentials = {
        email: this.emailControl?.value,
        password: this.passwordControl?.value
      }

      this.userService.login(loginData).subscribe({
        next: (response) => {
          if(response.success) {
            this.router.navigate(['/cats'])
          }
        },
        error: (error) => {
          console.log('Error al loguear', error)
        },
        complete: () => {
          this._submitting.set(false)
        }
      })
    } else {
      this.loginForm.get('email')?.markAsTouched();
      this.loginForm.get('password')?.markAllAsTouched();
    }
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && !field.valid && field.touched);
  }

  goToRegister() {
    this.router.navigate(['register'])
  }
}
