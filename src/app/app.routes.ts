import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/components/home/home.component';
import { CalculatorComponent } from '../pages/components/calculator/calculator.component';
import { DetailsRouteComponent } from '../pages/components/details-route/details-route.component';

export const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'detalle', component: DetailsRouteComponent },
  { path: '**', redirectTo: 'calculator' }
];
