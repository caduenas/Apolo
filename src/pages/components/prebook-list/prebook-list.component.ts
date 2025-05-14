import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prebook-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prebook-list.component.html',
  styleUrls: ['./prebook-list.component.scss'] 
})
export class PrebookListComponent implements OnInit {

  rutas: any[] = [];
  rutasOriginal: any[] = [];
  cargando = true;

  puertosSalida: string[] = [];
  puertosLlegada: string[] = [];
  tiposContenedor: string[] = [];

  filtros = {
    puertoSalida: '',
    puertoLlegada: '',
    precioMin: null,
    precioMax: null,
    tipoContenedor: ''
  };

  ngOnInit(): void {
    setTimeout(() => {
      this.rutas = [
        {
          "puertoSalida": "Callao",
          "puertoLlegada": "Hong Kong",
          "precio": 1500,
          "dias": 30,
          "tipoContenedor": "FCL"
        },
        {
          "puertoSalida": "Guayaquil",
          "puertoLlegada": "Singapur",
          "precio": 1380,
          "dias": 28,
          "tipoContenedor": "FCL"
        },
        {
          "puertoSalida": "Buenaventura",
          "puertoLlegada": "Busan",
          "precio": 1620,
          "dias": 35,
          "tipoContenedor": "FCL"
        },
        {
          "puertoSalida": "San Antonio",
          "puertoLlegada": "Shanghái",
          "precio": 1450,
          "dias": 32,
          "tipoContenedor": "FCL"
        },
        {
          "puertoSalida": "Cartagena",
          "puertoLlegada": "Ningbo",
          "precio": 1550,
          "dias": 29,
          "tipoContenedor": "FCL"
        }
      ];

      this.rutasOriginal = [...this.rutas];

      // ✅ Extraer valores únicos
      this.puertosSalida = [...new Set(this.rutasOriginal.map(r => r.puertoSalida))];
      this.puertosLlegada = [...new Set(this.rutasOriginal.map(r => r.puertoLlegada))];
      this.tiposContenedor = [...new Set(this.rutasOriginal.map(r => r.tipoContenedor))];

      this.cargando = false;
    }, 1000);
  }

  prebook(ruta: any) {
    console.log("Prebook", ruta);
  }

  filtrarRutas() {
    this.rutas = this.rutasOriginal.filter(r => {
      return (
        (!this.filtros.puertoSalida || r.puertoSalida === this.filtros.puertoSalida) &&
        (!this.filtros.puertoLlegada || r.puertoLlegada === this.filtros.puertoLlegada) &&
        (!this.filtros.precioMin || r.precio >= this.filtros.precioMin) &&
        (!this.filtros.precioMax || r.precio <= this.filtros.precioMax) &&
        (!this.filtros.tipoContenedor || r.tipoContenedor === this.filtros.tipoContenedor)
      );
    });
  }

  limpiarFiltros() {
    this.filtros = {
      puertoSalida: '',
      puertoLlegada: '',
      precioMin: null,
      precioMax: null,
      tipoContenedor: ''
    };
    this.rutas = [...this.rutasOriginal];
  }
}
