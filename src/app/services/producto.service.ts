import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProducto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http= inject(HttpClient);
  private apiUrl = '/api/v1/productos'

  constructor() { }

   getProductos():Observable<IProducto[]>{
    return this.http.get<IProducto[]>(this.apiUrl);
   }
   createProducto(productoData:Partial<IProducto>):Observable<IProducto>{
    return this.http.post<IProducto>(this.apiUrl,productoData);
   }

   deleteProducto(productoId:number):Observable<void>{
   return this.http.delete<void>(`${this.apiUrl}/${productoId}`);
   }

   updateProducto(productoId:number, productoData:Partial<IProducto>)
   :Observable<IProducto>{
    return this.http.put<IProducto>(`${this.apiUrl}/${productoId}`, productoData);
   }

   uploadProductoImage(id: number, file: File) {
  const fd = new FormData();
  fd.append('file', file); 

  return this.http.post<IProducto>(
    `/api/v1/productos/${id}/image`,
    fd,
    { observe: 'response' }        
  );
}
   
   getProductoById(productoId: number): Observable<IProducto> {
    return this.http.get<IProducto>(`${this.apiUrl}/${productoId}`);
  }
}
