import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@/auth/services/authService';

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registerPage.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isPosting = signal(false);
  hasError = signal(false);

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 3000);
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();

    this.isPosting.set(true);
    this.hasError.set(false);

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.hasError.set(true);
        this.isPosting.set(false);
      },
      complete: () => {
        this.isPosting.set(false);
      },
    });
  }
}