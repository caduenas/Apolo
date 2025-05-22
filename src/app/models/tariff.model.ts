/**
 * Interfaz que define la estructura de una linea de catgo dentro de la ruta.
 */
export interface Line{
    "currency": string,
    "chargeCode": string,
    "unit": string,
    "value": number,
    "minApplied": number,
    "maxApplied": number
}

export interface Ruta{
    "type": string,
    "organization": string,
    "carrier": string,
    "serviceProvider": string,
    "freeDays": number,
    "dropOff": number,
    "startDate": Date,
    "endDate": Date,
    "origin": string,
    "destination": string,
    "via": string,
    "category": string,
    "container": string,
    "lines": Line[];
}