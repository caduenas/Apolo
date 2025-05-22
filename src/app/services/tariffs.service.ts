import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { signal } from "@angular/core";
import { tap } from "rxjs/operators"
import { Ruta } from "../models";


@Injectable({providedIn: 'root'})
export class tariffs {
    private http = inject(HttpClient)
    routes = signal<Ruta[]>([]);

    postData(body: Ruta){
        const url = '/api/GetTariffRates';
        const username = 'test1';
        const password = 'test1'
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        });
        return this.http.post<Ruta[]>(url, body, { headers }).pipe(
            tap((data) => this.routes.set(data))
        );
    }

    getRoutesSignal(){
        return this.routes;
    }
}