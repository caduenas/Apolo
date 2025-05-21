import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tariffs } from '../../../app/services/tariffs.service'

@Component({
  selector: 'app-prebook-list',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './prebook-list.component.html',
  styleUrls: ['./prebook-list.component.scss'] 
})
export class PrebookListComponent implements OnInit {
  // Llamado al Signal 
  private api = inject(tariffs);
  //Formulario de filtros
  filtrosForm!: FormGroup;
  tiposContenedor = [];
  rutasOriginal: any[] = [];
  cargando = true;
  puertosSalida: string[] = [];
  puertosLlegada: string[] = [];
  filtros = signal({
    origin: '',
    destination: '',
    precioMin: null,
    precioMax: null,
    tipoContenedor: '',
  });
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
      this.filtrosForm = this.fb.group({
      precioMin: [''],
      precioMax: [''],
      tipoContenedor: [''],
      origin: [''],
      destination: ['']
    });
    const rutasSignal = this.api.getRoutesSignal();
    this.rutasOriginal = [...rutasSignal()]
  }
  rutasFiltradas = computed(()=> {
    const filtros = this.filtros();
    const rutas = this.rutasOriginal;

    return rutas.filter(r => {
      return (
        (!filtros.origin || r.origin === filtros.origin) &&
        (!filtros.destination || r.destination === filtros.destination) &&
        (!filtros.precioMin || r.precio >= filtros.precioMin ) &&
        (!filtros.precioMax || r.precio <= filtros.precioMax) &&
        (!filtros.tipoContenedor || r.tipoContenedor === filtros.tipoContenedor)
      )
    })
  })
  filtrarRutas(){
    const f = this.filtrosForm.value;
    this.filtros.set({
      origin: f.origin,
      destination: f.destination,
      precioMin: f.precioMin,
      precioMax: f.precioMax,
      tipoContenedor: f.tipoContenedor
    });
  }
  limpiarFiltros(){
    this.filtros.set({
      origin: '',
      destination: '',
      precioMin: null,
      precioMax: null,
      tipoContenedor: '',
    });
  }

  prebook(ruta: any) {
    console.log("Prebook", ruta);
  }
}
