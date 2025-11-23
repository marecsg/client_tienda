import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICliente } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http= inject(HttpClient);
  private apiUrl= '/api/v1/clientes';

  constructor() { }

    getAll(): Observable<ICliente[]> {
    return this.http.get<ICliente[]>(this.apiUrl);
  }

  getById(id: number): Observable<ICliente> {
    return this.http.get<ICliente>(`${this.apiUrl}/${id}`);
  }

  create(clienteData:Partial<ICliente>): Observable<ICliente> {
    return this.http.post<ICliente>(this.apiUrl, clienteData);
  }

  update(id: number, clienteData:Partial<ICliente>): Observable<ICliente> {
    return this.http.put<ICliente>(`${this.apiUrl}/${id}`, clienteData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // extras del backend (si quieres usarlos):
  getByDni(dni: string): Observable<ICliente> {
    return this.http.get<ICliente>(`${this.apiUrl}/by-dni/${dni}`);
  }
  getByNombre(nombre: string): Observable<ICliente[]> {
    return this.http.get<ICliente[]>(`${this.apiUrl}/by-nombre?nombre=${encodeURIComponent(nombre)}`);
  }
}
