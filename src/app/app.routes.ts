import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/components/home/home.component';
import { CalculatorComponent } from '../pages/components/calculator/calculator.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: '**', redirectTo: '' }
];
