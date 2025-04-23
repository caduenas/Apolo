import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit {
  formulario!: FormGroup;

  // Simulación de puertos, puedes reemplazarlo con datos de un servicio
  puertos = [
    { code: 'VAL', name: 'Valencia' },
    { code: 'BCN', name: 'Barcelona' },
    { code: 'MRS', name: 'Marsella' },
    { code: 'RTM', name: 'Róterdam' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      puertoSalida: ['', Validators.required],
      puertoLlegada: ['', Validators.required],
      fecha: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  buscar(): void {
    if (this.formulario.valid) {
      const datos = this.formulario.value;
      console.log('🔍 Datos del formulario:', datos);
      // Aquí puedes hacer la lógica para enviar a un servicio, buscar rutas, etc.
    } else {
      console.log('⚠️ Formulario inválido');
      this.formulario.markAllAsTouched();
    }
  }
}