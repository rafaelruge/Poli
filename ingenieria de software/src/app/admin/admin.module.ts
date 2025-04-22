import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionarSolicitudesComponent } from './gestionar-solicitudes/gestionar-solicitudes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { RutasRecoleccionComponent } from './rutas-recoleccion/rutas-recoleccion.component';


@NgModule({
  declarations: [
    DashboardComponent,
    GestionarSolicitudesComponent,
    EstadisticasComponent,
    RutasRecoleccionComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
