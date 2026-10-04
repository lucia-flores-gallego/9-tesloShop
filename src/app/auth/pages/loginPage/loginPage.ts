import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@/auth/services/authService';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './loginPage.html',
})
export class LoginPage {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 3000);
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.isPosting.set(true);
    this.hasError.set(false);

    this.authService.login(email, password).subscribe({
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
