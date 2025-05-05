import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PuertoService } from '../../../app/services/puerto.service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit {
  formulario!: FormGroup;
  puertos: { code: string; name: string; country_code: string; country_name: string; region: string }[] = [];
  

  constructor(private fb: FormBuilder, private puertoService: PuertoService) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      puertoSalida: ['', Validators.required],
      puertoLlegada: ['', Validators.required],
      fecha: ['', [Validators.required, this.fechaNoPasadaValidator()]],
      tipo: ['', Validators.required]
    });

    this.puertoService.getPuertos().subscribe({
      next: (data) => {
        this.puertos = data;
      },
      error: (err) => {
        console.error('❌ Error cargando puertos:', err);
      }
    });
  }

  buscar(): void {
    if (this.formulario.valid) {
      const datos = this.formulario.value;
      console.log('🔍 Datos del formulario:', datos);
    } else {
      console.log('⚠️ Formulario inválido');
      this.formulario.markAllAsTouched();
    }
  }

  campoInvalido(campo : string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  sugerenciasSalida: { code: string; name: string; country_name: string; region: string }[] = [];
  sugerenciasLlegada: { code: string; name: string; country_name: string; region: string }[] = [];


  filtrarPuertos(campo: 'puertoSalida' | 'puertoLlegada'): void {
    const control = this.getControl(campo);
    if (!control) return;    
  
    const valor = control.value?.toLowerCase() || '';
    const sugerencias = this.puertos.filter(p =>
      p.name.toLowerCase().includes(valor)
    );
  
    if (campo === 'puertoSalida') {
      this.sugerenciasSalida = sugerencias.slice(0,4);
    } else {
      this.sugerenciasLlegada = sugerencias.slice(0,4);
    }
  }
  
  seleccionarPuerto(campo: 'puertoSalida' | 'puertoLlegada', puerto: { code: string; name: string }): void {
    const control = this.getControl(campo);
    if (!control) return;    
  
    control.setValue(puerto.name);
    if (campo === 'puertoSalida') {
      this.sugerenciasSalida = [];
    } else {
      this.sugerenciasLlegada = [];
    }
  }

  private getControl(campo: string): FormControl<any> | null {
    const control = this.formulario.get(campo);
    return control instanceof FormControl ? control : null;
  }
  
  fechaNoPasadaValidator() {
    return (control: FormControl) => {
      const fechaIngresada = new Date(control.value);
      const hoy = new Date();
      
      hoy.setHours(0, 0, 0, 0);
      fechaIngresada.setHours(0, 0, 0, 0);
  
      if (fechaIngresada < hoy) {
        return { fechaPasada: true };
      }
  
      return null; 
    };
  }
}