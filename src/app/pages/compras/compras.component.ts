import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompraResponse, CompraService } from '../../services/compra.service';
import { IProveedor } from '../../interfaces/proveedor.interface';
import { IProducto } from '../../interfaces/producto.interface';
import { ProveedorService } from '../../services/proveedor.service';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit{

  compras: CompraResponse[] = [];
  proveedores: IProveedor[] = [];
  productos: IProducto[] = [];

  // Filtros
  filtroProveedorId: number | null = null;
  filtroDesde: string = '';
  filtroHasta: string = '';

  // Paginación y selección
  p: number = 1;
  selectedCompra: CompraResponse | null = null;

  constructor(
    private compraService: CompraService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // Cargar catálogos auxiliares para mostrar nombres en lugar de IDs
    this.proveedorService.getAll().subscribe(data => this.proveedores = data);
    this.productoService.getProductos().subscribe(data => this.productos = data);
    
    // Cargar lista principal
    this.loadCompras();
  }

  loadCompras() {
    const params: any = {};
    if (this.filtroProveedorId) params.proveedorId = this.filtroProveedorId;
    if (this.filtroDesde) params.desde = this.filtroDesde;
    if (this.filtroHasta) params.hasta = this.filtroHasta;

    this.compraService.getAll(params).subscribe({
      next: (res) => {
        this.compras = res;
        this.p = 1; // Reset paginación al filtrar
      },
      error: (err) => console.error('Error cargando compras', err)
    });
  }

  limpiarFiltros() {
    this.filtroProveedorId = null;
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.loadCompras();
  }

  irNuevaCompra() {
    this.router.navigate(['/compras/new']);
  }

  verDetalle(c: CompraResponse) {
    this.selectedCompra = c;
  }

  cerrarDetalle() {
    this.selectedCompra = null;
  }

  // Helpers para mostrar nombres en la tabla
  getProveedorNombre(id: number): string {
    const p = this.proveedores.find(x => x.id === id);
    return p ? p.nombre : `Proveedor #${id}`;
  }

  getProductoNombre(id: number): string {
    const p = this.productos.find(x => x.id === id);
    return p ? p.nombre : `Producto #${id}`;
  }

  get totalFiltrado(): number {
    return this.compras.reduce((acc, c) => acc + c.total, 0);
  }

}
