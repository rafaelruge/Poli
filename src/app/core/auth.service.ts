import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private defaultUsers = [
    { email: 'admin@residuos.com', password: 'admin123', rol: 'admin' },
    { email: 'ciudadano@residuos.com', password: '123456', rol: 'ciudadano' }
  ];

  constructor(private router: Router) {
    // Si no hay usuarios en localStorage, guarda los predeterminados
    if (!localStorage.getItem('usuarios')) {
      localStorage.setItem('usuarios', JSON.stringify(this.defaultUsers));
    }
  }

  login(email: string, password: string): boolean {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = usuarios.find((u: any) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(usuario: any): void {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.rol || null;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
