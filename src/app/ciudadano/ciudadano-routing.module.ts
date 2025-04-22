import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolicitarRecoleccionComponent } from './solicitar-recoleccion/solicitar-recoleccion.component';
import { PuntosEcologicosComponent } from './puntos-ecologicos/puntos-ecologicos.component';
import { HistorialComponent } from './historial/historial.component';
import { AuthGuard } from '../core/auth.guard';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { rol: 'ciudadano' },
    children: [
      { path: '', redirectTo: 'solicitar', pathMatch: 'full' },
      { path: 'solicitar', component: SolicitarRecoleccionComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'puntos', component: PuntosEcologicosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CiudadanoRoutingModule {}
