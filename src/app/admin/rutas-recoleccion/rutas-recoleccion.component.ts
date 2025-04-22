import { Component } from '@angular/core';
import { latLng, tileLayer, marker, polyline, icon, Map, Layer } from 'leaflet';

@Component({
  selector: 'app-rutas-recoleccion',
  standalone: false,
  templateUrl: './rutas-recoleccion.component.html',
  styleUrl: './rutas-recoleccion.component.scss'
})
export class RutasRecoleccionComponent {
  options = {
    center: latLng(4.65, -74.1),
    zoom: 12,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ]
  };

  layers: Layer[] = [
    // Marcadores de puntos
    marker(latLng(4.6538, -74.0584), {
      icon: icon({
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png',
        iconSize: [40, 41],
        iconAnchor: [13, 41]
      })
    }).bindPopup("<strong>Chapinero</strong><br>Estado: Completada ✅"),

    marker(latLng(4.7026, -74.0346)).bindPopup("<strong>Usaquén</strong><br>Estado: En curso 🚚"),

    marker(latLng(4.6261, -74.1575)).bindPopup("<strong>Kennedy</strong><br>Estado: Pendiente ⏳"),

    // Ruta 1 - Completada (verde)
    polyline([
      latLng(4.6538, -74.0584),
      latLng(4.7026, -74.0346)
    ], {
      color: 'green'
    }).bindPopup("Ruta Chapinero → Usaquén (Completada)"),

    // Ruta 2 - En curso (amarillo)
    polyline([
      latLng(4.7026, -74.0346),
      latLng(4.6261, -74.1575)
    ], {
      color: 'orange',
      dashArray: '6, 6'
    }).bindPopup("Ruta Usaquén → Kennedy (En curso)"),

    // Ruta pendiente - roja
    polyline([
      latLng(4.6538, -74.0584),
      latLng(4.6261, -74.1575)
    ], {
      color: 'red',
      dashArray: '2, 8'
    }).bindPopup("Ruta alternativa (Pendiente)")
  ];
}
