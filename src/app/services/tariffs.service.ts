import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop"
import { tap } from "rxjs/operators"


@Injectable({providedIn: 'root'})
export class tariffs {
    private http = inject(HttpClient)
    routes = signal<any[]>([]);

    postData(body: any){
        const url = 'https://eos-api-llab-qa.azurewebsites.net/api/GetTariffRates';
        const username = 'test1';
        const password = 'test1'
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        });
        return this.http.post<any[]>(url, body, { headers }).pipe(
            tap((data) => this.routes.set(data))
        );
    }

    getRoutesSignal(){
        return this.routes;
    }
}