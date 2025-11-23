import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProveedor } from '../interfaces/proveedor.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private http= inject(HttpClient);
  private apiUrl = '/api/v1/proveedores'

  constructor() { }

  getAll(): Observable<IProveedor[]> {
      return this.http.get<IProveedor[]>(this.apiUrl);
    }
  
    getById(id: number): Observable<IProveedor> {
      return this.http.get<IProveedor>(`${this.apiUrl}/${id}`);
    }
  
    create(proveedorData:Partial<IProveedor>): Observable<IProveedor> {
      return this.http.post<IProveedor>(this.apiUrl, proveedorData);
    }
  
    update(id: number, proveedorData:Partial<IProveedor>): Observable<IProveedor> {
      return this.http.put<IProveedor>(`${this.apiUrl}/${id}`, proveedorData);
    }
  
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    getByDni(ruc: string): Observable<IProveedor> {
      return this.http.get<IProveedor>(`${this.apiUrl}/by-ruc/${ruc}`);
    }
    getByNombre(nombre: string): Observable<IProveedor[]> {
      return this.http.get<IProveedor[]>(`${this.apiUrl}?nombre=${encodeURIComponent(nombre)}`);
    }
}

