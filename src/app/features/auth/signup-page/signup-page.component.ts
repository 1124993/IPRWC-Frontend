import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-signup-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
    ],
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.scss'],
})
export class SignUpPageComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);
    private snack = inject(MatSnackBar);

    hide = signal(true);
    loading = signal(false);
    errorMsg = signal<string | null>(null);

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    });

    submit(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.form.invalid || this.loading()) return;

        this.loading.set(true);
        this.errorMsg.set(null);

        const { email, password } = this.form.getRawValue();
        this.auth.signup({ email: email!, password: password! }).subscribe({
            next: () => {
                // success (201 empty body) → go to login with success flag
                this.loading.set(false);
                this.router.navigate(['/login'], { queryParams: { signup: 'ok' } });
            },
            error: (err: unknown) => {
                this.loading.set(false);
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 400 && err.error?.message) {
                        this.errorMsg.set(err.error.message); // e.g., "Email already registered"
                        return;
                    }
                }
                this.errorMsg.set('Sign up failed. Please try again.');
            }
        });
    }
}
