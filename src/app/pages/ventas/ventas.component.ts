import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICliente } from '../../interfaces/cliente.interface';
import { VentaResponse, VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { IProducto } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {
  ventas: VentaResponse[] = [];
  clientes: ICliente[] = [];
  productos: IProducto[] = [];


  filtroClienteId: number | null = null;
  filtroDesde: string = '';
  filtroHasta: string = '';

  selectedVenta: VentaResponse | null = null;

  p: number = 1;

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientes();
    this.loadVentas();
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: res => this.productos = res,
      error: err => console.error('Error al cargar productos', err)
    });
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: res => this.clientes = res,
      error: err => console.error('Error al cargar clientes', err)
    });
  }

  loadVentas(): void {
    const params: any = {};
    if (this.filtroClienteId) params.clienteId = this.filtroClienteId;
    if (this.filtroDesde) params.desde = this.filtroDesde;
    if (this.filtroHasta) params.hasta = this.filtroHasta;

    this.ventaService.getAll(params).subscribe({
      next: res => this.ventas = res,
      error: err => console.error('Error al cargar ventas', err)
    });
  }

  limpiarFiltros(): void {
    this.filtroClienteId = null;
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.loadVentas();
  }

  irANuevaVenta(): void {
    this.router.navigate(['/ventas/new']);
  }

  verBoleta(v: VentaResponse): void {
    this.selectedVenta = v;
  }

  cerrarBoleta(): void {
    this.selectedVenta = null;
  }

  get totalFiltrado(): number {
    return this.ventas.reduce((acc, v) => acc + v.total, 0);
  }

  getClienteNombre(id: number): string {
    const c = this.clientes.find(x => x.id === id);
    return c ? c.nombres : `Cliente ${id}`;
  }

  getProductoNombre(id: number): string {
    const p = this.productos.find(x => x.id === id);
    return p ? p.nombre : `Producto ${id}`;
  }

  getClienteDescripcion(id: number): string {
    const c = this.clientes.find(x => x.id === id);
    return c ? `${c.nombres} (DNI: ${c.dni})` : `Cliente ${id}`;
  }
}
