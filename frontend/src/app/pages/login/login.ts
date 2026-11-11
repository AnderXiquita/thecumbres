import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required],
  });

  error = '';
  cargando = false;

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Ingresa tu usuario y contraseña';
      return;
    }

    this.cargando = true;
    this.error = '';
    const { usuario, password } = this.form.getRawValue();

    this.auth.login(usuario, password).subscribe({
      next: () => this.router.navigate(['/tours']),
      error: (err) => {
        this.error = err.error?.mensaje ?? 'No se pudo conectar con el servidor';
        this.cargando = false;
      },
    });
  }
}