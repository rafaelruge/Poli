import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadisticas',
  standalone: false,
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent implements OnInit {
  solicitudes: any[] = [];
  
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  // Gráfico de barras (por estado)
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
    datasets: [
      {
        label: 'Solicitudes por estado',
        data: [0, 0, 0, 0],
        backgroundColor: ['#FFCA28', '#66BB6A', '#EF5350', '#BDBDBD']
      }
    ]
  };
  barChartType: ChartType = 'bar';

  // Gráfico de pastel (por tipo)
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Residuos orgánicos', 'Comida vencida', 'Restos de jardinería'],
    datasets: [
      {
        label: 'Tipos de residuo',
        data: [0, 0, 0],
        backgroundColor: ['#8BC34A', '#FFA726', '#A1887F']
      }
    ]
  };
  pieChartType: ChartType = 'pie';

  ngOnInit(): void {
    const datos = localStorage.getItem('solicitudes');
    this.solicitudes = datos ? JSON.parse(datos) : [];

    this.contarPorEstado();
    this.contarPorTipo();
  }

  contarPorEstado() {
    const estados = ['pendiente', 'aprobada', 'rechazada', 'cancelada'];
    this.barChartData.datasets[0].data = estados.map(
      estado => this.solicitudes.filter(s => s.estado === estado).length
    );
  }

  contarPorTipo() {
    const tipos = ['Residuos orgánicos', 'Comida vencida', 'Restos de jardinería'];
    this.pieChartData.datasets[0].data = tipos.map(
      tipo => this.solicitudes.filter(s => s.tipo === tipo).length
    );
  }
}
