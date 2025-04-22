import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-solicitar-recoleccion',
  templateUrl: './solicitar-recoleccion.component.html',
  styleUrls: ['./solicitar-recoleccion.component.scss'],
  standalone:false
})
export class SolicitarRecoleccionComponent implements OnInit {
  form: FormGroup;
  userNombre = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      tipo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userNombre = user?.nombre || '';
  }

  onSubmit(): void {
    const user = this.authService.getUser();
    if (this.form.valid && user) {
      const nuevaSolicitud = {
        id: Date.now(),
        nombre: user.nombre, // ✅ Se toma del usuario autenticado
        email: user.email,
        fecha: new Date().toISOString().split('T')[0],
        tipo: this.form.value.tipo,
        estado: 'pendiente'
      };

      const existentes = JSON.parse(localStorage.getItem('solicitudes') || '[]');
      existentes.push(nuevaSolicitud);
      localStorage.setItem('solicitudes', JSON.stringify(existentes));

      alert('Solicitud enviada con éxito');
      this.form.reset();
    }
  }
}
