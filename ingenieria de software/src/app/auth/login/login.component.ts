import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const { email, password } = this.form.value;
    const loginExitoso = this.authService.login(email, password);

    if (loginExitoso) {
      const rol = this.authService.getUserRole();
      this.router.navigate([`/${rol}`]); // redirige a /admin o /ciudadano
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }
}
