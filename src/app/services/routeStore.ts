import { Injectable, signal } from "@angular/core";
import { Ruta } from "../models";

@Injectable({ providedIn: 'root'})
export class RouteStore {
    private selectRoute = signal<Ruta | null>(null);

    setSelectedRoute(ruta: Ruta){
        this.selectRoute.set(ruta);
    }

    getSelectedRoute(){
        return this.selectRoute.asReadonly();
    }
}