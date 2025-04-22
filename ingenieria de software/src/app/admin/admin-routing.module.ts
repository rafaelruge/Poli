import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionarSolicitudesComponent } from './gestionar-solicitudes/gestionar-solicitudes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { RutasRecoleccionComponent } from './rutas-recoleccion/rutas-recoleccion.component';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { rol: 'admin' },
    children: [
      { path: '', redirectTo: 'gestionar', pathMatch: 'full' },
      { path: 'gestionar', component: GestionarSolicitudesComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
      { path: 'rutas', component: RutasRecoleccionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
