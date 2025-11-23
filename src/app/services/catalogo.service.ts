import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ICategoria { id: number; nombre: string; }
export interface ITalla     { id: number; nombre: string; }

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private http = inject(HttpClient);
  private base = '/api/v1/catalogo';

  getCategorias(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(`${this.base}/categorias`);
  }
  createCategoria(nombre: string): Observable<ICategoria> {
    return this.http.post<ICategoria>(`${this.base}/categorias`, { nombre });
  }

  getTallas(): Observable<ITalla[]> {
    return this.http.get<ITalla[]>(`${this.base}/tallas`);
  }
  createTalla(nombre: string): Observable<ITalla> {
    return this.http.post<ITalla>(`${this.base}/tallas`, { nombre });
  }

  constructor() { }
}
