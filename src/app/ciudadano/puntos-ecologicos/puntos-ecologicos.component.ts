import { Component, AfterViewInit } from '@angular/core';
import {
  latLng, tileLayer, marker, icon, Marker, LatLngBounds, Map
} from 'leaflet';

@Component({
  selector: 'app-puntos-ecologicos',
  templateUrl: './puntos-ecologicos.component.html',
  styleUrls: ['./puntos-ecologicos.component.scss'],
  standalone: false
})
export class PuntosEcologicosComponent implements AfterViewInit {
  map!: Map;

  puntos = [
    {
      nombre: 'Punto Verde Chapinero',
      coords: latLng(4.6538, -74.0584),
      descripcion: 'Recolección de residuos orgánicos de lunes a sábado'
    },
    {
      nombre: 'Punto Verde Usaquén',
      coords: latLng(4.7026, -74.0346),
      descripcion: 'Abierto de 8am a 5pm, acepta restos de comida y jardín'
    },
    {
      nombre: 'Punto Verde Kennedy',
      coords: latLng(4.6261, -74.1575),
      descripcion: 'Punto comunitario activo los fines de semana'
    }
  ];

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: latLng(4.6538, -74.0584)
  };

  marcadores = this.puntos.map(p =>
    marker(p.coords, {
      icon: icon({
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png',
        iconSize: [50, 50],
        iconAnchor: [50, 50]      
      })
    }).bindPopup(`<strong>${p.nombre}</strong><br>${p.descripcion}`)
  );
  

  onMapReady(map: Map): void {
    this.map = map;
    const bounds = new LatLngBounds(this.puntos.map(p => p.coords));
    map.fitBounds(bounds, { padding: [30, 30] });
    setTimeout(() => this.map.invalidateSize(), 200); // 🔥 clave para rutas hijas
  }

  ngAfterViewInit(): void {
    // Se puede dejar vacío o usar más adelante si necesitas eventos del DOM
  }
  
}

