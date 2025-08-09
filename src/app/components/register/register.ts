import { Component, inject, signal } from '@angular/core';
import { Users } from '../../services/users';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterData } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private userService = inject(Users);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private _submitting = signal(false);
  readonly submitting = this._submitting.asReadonly();

  readonly isLoading = this.userService.isLoading;
  readonly authError = this.userService.authError;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    lastName: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  })

  constructor() {
  }

  get firstNameControl() {
    return this.registerForm.get('firstName');
  }

  get lastNameControl() {
    return this.registerForm.get('lastName');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  onSubmit() {
    if(this.registerForm.valid && !this.isLoading()) {
      this._submitting.set(true);

      const userData: RegisterData = {
        firstName: this.firstNameControl?.value,
        lastName: this.lastNameControl?.value,
        email: this.emailControl?.value,
        password: this.passwordControl?.value,
      }

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          if(response.success) {
            console.log('Registro exitoso')
          }
        },
        error: (error) => {
          console.error('Error creando usuario', error)
        },
        complete: () => {
          this._submitting.set(false);
        }
      })
    } else {
      this.firstNameControl?.markAsTouched();
      this.lastNameControl?.markAsTouched();
      this.emailControl?.markAsTouched();
      this.passwordControl?.markAsTouched();
    }
  }

  hasFieldError(fieldame: string): boolean {
    const field = this.registerForm.get(fieldame);
    return !!(field && field.invalid && field.touched);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
