import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  standalone:false
})
export class HistorialComponent implements OnInit {
  solicitudes: any[] = [];
  historial: any[] = [];
  userEmail = '';
  userNombre = '';
  form: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userEmail = user?.email || '';
    this.userNombre = user?.nombre || '';
    const data = localStorage.getItem('solicitudes');
    this.historial = data ? JSON.parse(data) : [];
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
  exportarExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.historial);
    const workbook = { Sheets: { 'Historial': worksheet }, SheetNames: ['Historial'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'historial-recoleccion.xlsx');
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    const columnas = ["Nombre", "Tipo", "Fecha", "Dirección", "Estado"];
    const filas = this.historial.map((s: any) => [
      s.nombre,
      s.tipo,
      s.fecha,
      s.direccion,
      s.estado
    ]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      theme: 'grid'
    });

    doc.save('historial-recoleccion.pdf');
  }
}
