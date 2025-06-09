import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tariffs } from '../../../app/services/tariffs.service'
import { Ruta, Line } from '../../../app/models/tariff.model';
import { Router } from '@angular/router';
import { RouteStore } from '../../../app/services/routeStore';

@Component({
  selector: 'app-prebook-list',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './prebook-list.component.html',
  styleUrls: ['./prebook-list.component.scss'] 
})
export class PrebookListComponent implements OnInit {
  private router = inject(Router);
  private routeStore = inject(RouteStore)


  /**
   * @param() signal: Recibe el array de las rutas desde el componente padre
   * Es la funte principal de data de componente se inicializa en null desde el padre
   */
  rutasDataSignal = input.required<Ruta[] | null>();
  /**
   * FormGroup se usa para manejar el formulario de filtros de este componente
   */
  filtrosForm!: FormGroup;
  tiposContenedor = [];
  rutasOriginal: any[] = [];
  puertosSalida: string[] = [];
  puertosLlegada: string[] = [];
  /**
   * Este signal almacena el estado actual de los filtros aplicados por el usuario
   * Cada ves que este signal cambia, se reevalua el computed 'rutasFiltradas'
   */
  filtros = signal({
    origin: '',
    destination: '',
    precioMin: null,
    precioMax: null,
    tipoContenedor: '',
  });
  /**
   *  Variable para mostrar un mensaje de carga. Se actualiza automaticamente
   *  dentro del compude 'rutasFiltradas' basado en el estado de 'rutasDataSignal'  
   */
  cargando = computed(()=> {
    return this.rutasDataSignal() == null
  })
  constructor(private fb: FormBuilder) {}
  /**
   * Hook del ciclo de vida OnInit. Se ejcuta una vez cuando el componente se inicializa.
   * Aqui se inicializa el formulario de filtros.
   */
  ngOnInit(): void {
      this.filtrosForm = this.fb.group({
      precioMin: [''],
      precioMax: [''],
      tipoContenedor: [''],
      origin: [''],
      destination: ['']
    });
  }
  /**
   * Computed signal que filtra las rutas basandose en los criterios definidos en 'filtros'.
   * Se reevaluara automaticamente cada vez que 'filtros' o 'rutasDataSignal' cambian. 
   */
  rutasFiltradas = computed(()=> {
    const filtros = this.filtros();
    const rutas = this.rutasDataSignal() || [];
    // Se actualiza el estado de carga para la UI
    // Si 'rutasDataSignal' es null, estamos esperando datos 
    // Si es un array vacio, no hay rutas y no estamos cargando activamente
    return rutas.filter(r => {
      const precioRuta = this.getPrecioDeRuta(r);
      const tipoContenedorRuta = this.getContenedorDeRuta(r);
      return (
        // Se aplican los filtros uno a uno
        (!filtros.origin || r.origin === filtros.origin) &&
        (!filtros.destination || r.destination === filtros.destination) &&
        (!filtros.precioMin || precioRuta >= filtros.precioMin ) &&
        (!filtros.precioMax || precioRuta <= filtros.precioMax) &&
        (!filtros.tipoContenedor || tipoContenedorRuta === filtros.tipoContenedor)
      );
    });
  });

  /**
   * Calcula el precio total de la ruta sumando los valores de todas las lineas de cargo 
   * @param ruta Objeto de la ruta que con tiene el array 'lines'
   * @returns La suma total de los precios de las lineas o 0 si no hay lineas validas
   */
  public getPrecioDeRuta (ruta: Ruta): number {
    let Totalprecio = 0
    if(ruta.lines && Array.isArray(ruta.lines)){
      for (const line of ruta.lines){
        if (typeof line.value === 'number'){
          Totalprecio += line.value
        }
      }
    }
    return Totalprecio; 
  }
  
  /**
   * Obtiene el tipo de contenedor de una ruta.
   * @param ruta Objeto de la ruta.
   * @returns El tipo de contenedor como string o null si no se encuentra
   */
  private getContenedorDeRuta (ruta: any): string | null {
    return ruta.container || null
  }

  /**
   * Aplica los filtros del formulario 'filtrosForm' a la señal 'filtros'.
   * Esto desencadena una reevaluacion de 'rutasFiltradas'
   */
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
  /**
   * Restablece el formulario de filtros y la señal 'filtros' a sus valores iniciales.
   * Esto tambien desencadena una reevaluacion de 'rutasFiltradas'.
   */
  limpiarFiltros(){
    this.filtrosForm.reset();
    this.filtros.set({
      origin: '',
      destination: '',
      precioMin: null,
      precioMax: null,
      tipoContenedor: '',
    });
  }

  prebook(ruta: Ruta) {
    this.routeStore.setSelectedRoute(ruta);
    this.router.navigate(['/detalle']);
    console.log("Prebook", ruta);
  }
}
