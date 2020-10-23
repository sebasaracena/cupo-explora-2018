import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CupoService {
   API_URL='http://146.83.102.95/bd/public/cupo.php/api';
  
  //API_URL='http://localhost/bd/public/cupo.php/api';
  constructor(private http:HttpClient) { }

  consultar_universidad(cupo:any){
    return this.http.post(`${this.API_URL}/carreras/mapa/`,cupo,{responseType: 'text'});
  }
  consultar_sede(cupo:any){
    return this.http.post(`${this.API_URL}/carreras/datos/`,cupo);
  }
  consultar_campos(cupo:any){
    return this.http.post(`${this.API_URL}/campus/datos/`,cupo);
  }
  consultar_region(cupo:any){
    return this.http.post(`${this.API_URL}/cupo/region/`,cupo,{responseType: 'text'});
  }

  select_region(cupo:any){
    return this.http.post(`${this.API_URL}/region/chile/`,cupo);
  }

  select_universidad(cupo:any){
    return this.http.post(`${this.API_URL}/select/universidad/`,cupo);
  }

  datos_carrera(cupo:any){
    return this.http.post(`${this.API_URL}/carreras/info/`,cupo);
  }
  datos_campus(cupo:any){
    return this.http.post(`${this.API_URL}/carreras/campus/`,cupo);
  }

  datos_cupo(cupo:any){
    return this.http.post(`${this.API_URL}/cupo/info/`,cupo);
  }
}
