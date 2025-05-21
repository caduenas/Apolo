import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PuertoService } from '../../../app/services/puerto.service';
import { PrebookListComponent } from "../prebook-list/prebook-list.component";
import { tariffs } from '../../../app/services/tariffs.service'

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, PrebookListComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit {
  private api = inject(tariffs);
  formulario!: FormGroup;
  inputOrigin: string = '';
  inputDestination: string = '';
  typeSeleccionado: string = "";
  puertos: { code: string; name: string; country_code: string; country_name: string; region: string }[] = [];
  mostrar = false
  
  constructor(private fb: FormBuilder, private puertoService: PuertoService) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      etdDate: ['', [Validators.required, this.etdDateNoPasadaValidator()]],
      containers : this.fb.group({
        type: ['', Validators.required],
        quantity: [0],
        volume: [0],
        weight: [0]
      })
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
    return this.formulario.get('containers.type')?.value === 'Aereo';

  }

  buscar(): void {
    const datos = this.formulario.value;
      this.api.postData(datos).subscribe({
        next: () => console.log("Datos enviados"),
        error: err => console.error("Error al enviar datos",err)
      });
      console.log('Datos del formulario:', datos);
  }

  campoInvalido(campo : string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  sugerenciasSalida: { code: string; name: string; country_name: string; region: string }[] = [];
  sugerenciasLlegada: { code: string; name: string; country_name: string; region: string }[] = [];


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