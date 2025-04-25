import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PuertoService {
    private puertosSubject = new BehaviorSubject<any[]>([]);
    private puertos$ = this.puertosSubject.asObservable();
    private jsonURL = 'assets/puertos.json';
    constructor(private http: HttpClient) {}

    getPuertos(): Observable<{ code: string; name: string; contry_code: string; country_code: string; country_name: string; region: string}[]>{
        if (this.puertosSubject.value.length === 0){
            this.cargarPuertos();
        }
        return this.puertos$;
    }

    private cargarPuertos(): void {
        this.http.get<{ code: string; name: string; contry_code: string; country_code: string; country_name: string; region: string}[]>(this.jsonURL).subscribe({
            next: (data) => {
                console.log('Puertos cargados:', data);
                this.puertosSubject.next(data);
            },
            error: (err) =>{
                console.error('Error cargando puertos:', err);
            }
        })
    }
}