import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DetalleVentaReq {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface VentaRequest {
  clienteId: number | null;
  usuarioId: number | null;
  fecha: string | null; // ISO string
  detalles: DetalleVentaReq[];
}

export interface DetalleVentaRes {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface VentaResponse {
  id: number;
  fecha: string;
  total: number;
  clienteId: number;
  usuarioId: number;
  detalles: DetalleVentaRes[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseUrl = '/api/v1/ventas';

  constructor(private http: HttpClient) {}

  getAll(params?: { clienteId?: number; desde?: string; hasta?: string }): Observable<VentaResponse[]> {
    let httpParams = new HttpParams();
    if (params?.clienteId) httpParams = httpParams.set('clienteId', params.clienteId);
    if (params?.desde) httpParams = httpParams.set('desde', params.desde);
    if (params?.hasta) httpParams = httpParams.set('hasta', params.hasta);

    return this.http.get<VentaResponse[]>(this.baseUrl, { params: httpParams });
  }

  create(req: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(this.baseUrl, req);
  }

  getById(id: number): Observable<VentaResponse> {
    return this.http.get<VentaResponse>(`${this.baseUrl}/${id}`);
  }
}
