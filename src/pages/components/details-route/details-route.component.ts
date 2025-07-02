import { Component, inject, OnInit } from '@angular/core';
import { RouteStore } from '../../../app/services/routeStore';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-route',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details-route.component.html',
  styleUrl: './details-route.component.scss'
})
export class DetailsRouteComponent implements OnInit {
  formulario!:FormGroup;
  private routeStore = inject(RouteStore);
  ruta = this.routeStore.getSelectedRoute();

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      Cantidad: [1]
    });
    if (!this.ruta()){
      console.log("Error")
    }
  }
}
