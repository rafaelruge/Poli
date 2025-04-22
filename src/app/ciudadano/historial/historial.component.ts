import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  standalone:false
})
export class HistorialComponent implements OnInit {
  solicitudes: any[] = [];
  userEmail = '';
  userNombre = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userEmail = user?.email || '';
    this.userNombre = user?.nombre || '';

    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    const todas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    this.solicitudes = todas.filter((s: any) => s.email === this.userEmail);
  }

  cancelarSolicitud(id: number): void {
    const todas = JSON.parse(localStorage.getItem('solicitudes') || '[]');

    const index = todas.findIndex((s: any) => s.id === id);
    if (index !== -1 && todas[index].estado === 'pendiente') {
      todas[index].estado = 'cancelada';
      localStorage.setItem('solicitudes', JSON.stringify(todas));
      this.cargarSolicitudes();
    }
  }
}
