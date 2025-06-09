import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PuertoService } from '../../../app/services/puerto.service';
import { PrebookListComponent } from "../prebook-list/prebook-list.component";
import { tariffs } from '../../../app/services/tariffs.service'
import { Puerto } from '../../../app/models/puerto.model';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, PrebookListComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit {
  formulario!: FormGroup;
  rutasDeLaApi = signal<any[] | null>(null);
  mostrarResultados = signal(false);
  private api = inject(tariffs);

  inputOrigin: string = '';
  inputDestination: string = '';
  typeSeleccionado: string = "";
  puertos: Puerto[] = [];
  mostrar = false
  
  constructor(private fb: FormBuilder, private puertoService: PuertoService) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      etdDate: ['', [Validators.required, this.etdDateNoPasadaValidator()]],
      containers : this.fb.array([
        this.fb.group({
          type: ['', Validators.required],
          quantity: [1],
          volume: [0],
          weight: [0]
        })
      ])
    });
    
    this.puertoService.getPuertos().subscribe({
      next: (data) => {
        this.puertos = data;
      },
      error: (err) => {
        console.error('Error cargando puertos:', err);
      }
    });

  }

  get esAereoSeleccionado(): boolean {
    return (this.formulario.get('containers') as FormArray).at(0)?.get('type')?.value === '20GP';
  }

  buscar(): void {
    this.mostrarResultados.set(true);
    this.rutasDeLaApi.set(null);

    const datos = this.formulario.value;
    this.api.postData(datos).subscribe({
      next: (response: any[]) => {
        this.rutasDeLaApi.set(response);
        console.log("Datos enviados con exito y respuesta recibida", response);
      },
      error: err => {
        console.error("Error al enviar datos o recibir respuesta", err);
        this.rutasDeLaApi.set([]);
      }
    });
  }

  campoInvalido(campo : string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  sugerenciasSalida: Puerto[] = [];
  sugerenciasLlegada: Puerto[] = [];


  filtrarPuertos(campo: 'origin' | 'destination', event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();

    const sugerencias = this.puertos.filter(p =>
      p.name.toLowerCase().includes(inputValue)
    );

    if (campo === 'origin') {
      this.inputOrigin = inputValue;
      this.sugerenciasSalida = sugerencias.slice(0, 4);
    } else {
      this.inputDestination = inputValue;
      this.sugerenciasLlegada = sugerencias.slice(0, 4);
    }
  }
  
  seleccionarPuerto(campo: 'origin' | 'destination', puerto: { code: string; name: string }): void {
    if (campo === 'origin') {
      this.inputOrigin = puerto.name;                      
      this.formulario.get('origin')?.setValue(puerto.code); 
      this.sugerenciasSalida = [];
    } else {
      this.inputDestination = puerto.name;
      this.formulario.get('destination')?.setValue(puerto.code);
      this.sugerenciasLlegada = [];
    }
  }

  private getControl(campo: string): FormControl<any> | null {
    const control = this.formulario.get(campo);
    return control instanceof FormControl ? control : null;
  }
  
  etdDateNoPasadaValidator() {
    return (control: FormControl) => {
      const etdDateIngresada = new Date(control.value);
      const hoy = new Date();
      
      hoy.setHours(0, 0, 0, 0);
      etdDateIngresada.setHours(0, 0, 0, 0);
  
      if (etdDateIngresada < hoy) {
        return { etdDatePasada: true };
      }
  
      return null; 
    };
  }
  
}