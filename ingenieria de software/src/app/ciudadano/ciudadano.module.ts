import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CiudadanoRoutingModule } from './ciudadano-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolicitarRecoleccionComponent } from './solicitar-recoleccion/solicitar-recoleccion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HistorialComponent } from './historial/historial.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SolicitarRecoleccionComponent,
    HistorialComponent
  ],
  imports: [
    CommonModule,
    CiudadanoRoutingModule,
    ReactiveFormsModule  
  ]
})
export class CiudadanoModule { }
