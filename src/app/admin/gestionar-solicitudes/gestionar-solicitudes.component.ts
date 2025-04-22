import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestionar-solicitudes',
  templateUrl: './gestionar-solicitudes.component.html',
  styleUrls: ['./gestionar-solicitudes.component.scss'],
  standalone:false
})
export class GestionarSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  estadoSeleccionado: string = 'todos';

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    const almacenadas = localStorage.getItem('solicitudes');
    this.solicitudes = almacenadas ? JSON.parse(almacenadas) : [];
    this.filtrarSolicitudes();
  }

  filtrarSolicitudes(): void {
    if (this.estadoSeleccionado === 'todos') {
      this.solicitudesFiltradas = [...this.solicitudes];
    } else {
      this.solicitudesFiltradas = this.solicitudes.filter(
        s => s.estado === this.estadoSeleccionado
      );
    }
  }

  actualizarEstado(id: number, nuevoEstado: string): void {
    const index = this.solicitudes.findIndex(s => s.id === id);
    if (index !== -1 && this.solicitudes[index].estado === 'pendiente') {
      this.solicitudes[index].estado = nuevoEstado;
      localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
      this.filtrarSolicitudes(); // actualiza lista filtrada
    }
  }
}
