import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DetalleCompraReq {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CompraRequest {
  proveedorId: number | null;
  usuarioId: number;
  fecha: string | null; 
  detalles: DetalleCompraReq[];
}

export interface DetalleCompraRes {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CompraResponse {
  id: number;
  fecha: string;
  total: number;
  proveedorId: number;
  usuarioId: number;
  detalles: DetalleCompraRes[];
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/compras';
  constructor() { }

  getAll(filtros?: { proveedorId?: number, desde?: string, hasta?: string }): Observable<CompraResponse[]> {
    let params = new HttpParams();
    let endpoint = this.apiUrl;

    if (filtros) {
      if (filtros.proveedorId) params = params.set('proveedorId', filtros.proveedorId);
      if (filtros.desde) params = params.set('desde', filtros.desde);
      if (filtros.hasta) params = params.set('hasta', filtros.hasta);

      // Si hay al menos un parámetro, cambiamos al endpoint de filtrado
      if (params.keys().length > 0) {
        endpoint = `${this.apiUrl}/filter`;
      }
    }

    return this.http.get<CompraResponse[]>(endpoint, { params });
  }

  getById(id: number): Observable<CompraResponse> {
    return this.http.get<CompraResponse>(`${this.apiUrl}/${id}`);
  }

  create(compra: CompraRequest): Observable<CompraResponse> {
    return this.http.post<CompraResponse>(this.apiUrl, compra);
  }
}
