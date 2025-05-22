import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Puerto } from "../models/index";

@Injectable({
    providedIn: 'root'
})
export class PuertoService {
    /**
   * @private puertosSubject: BehaviorSubject<Puerto[]>
   * Un BehaviorSubject es un tipo de Observable que necesita un valor inicial
   * y que siempre emite su valor actual a los nuevos suscriptores inmediatamente.
   * Lo usamos aquí para almacenar y gestionar el estado reactivo de la lista de puertos.
   * Se inicializa con un array vacío de objetos 'Puerto'.
   */
    private puertosSubject = new BehaviorSubject<Puerto[]>([]);
    private puertos$ = this.puertosSubject.asObservable();
    private jsonURL = 'assets/puertos.json';
    constructor(private http: HttpClient) {}

    getPuertos(): Observable<Puerto[]>{
    /**
     * Comprueba si el BehaviorSubject ya tiene datos (es decir, si los puertos ya se cargaron).
     * Si el array de valor actual está vacío, significa que es la primera vez que se solicita
     * o que aún no se han cargado los datos.*/
        if (this.puertosSubject.value.length === 0){
            this.cargarPuertos();
        }
        return this.puertos$;
    }

    /**
   * @private cargarPuertos(): void
   * Método privado encargado de realizar la petición HTTP para obtener los datos de los puertos
   * desde el archivo JSON.
   * Una vez que los datos son recibidos, los emite a través del 'puertosSubject'.
   */
    private cargarPuertos(): void {
        this.http.get<Puerto[]>(this.jsonURL).subscribe({
            next: (data) => {
                console.log('Puertos cargados correctamente');
                this.puertosSubject.next(data);
            },
            error: (err) =>{
                console.error('Error cargando puertos:', err);
            }
        })
    }
}