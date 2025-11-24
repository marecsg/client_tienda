import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  totalVentas: number = 0;
  totalClientes: number = 0;
  productosBajoStock: number = 0;
  ventasDelDia: number = 0;

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.cargarIndicadores();
  }

  cargarIndicadores() {
    // 1. Cargar total de clientes
    this.clienteService.getAll().subscribe({
      next: (res) => this.totalClientes = res.length,
      error: (e) => console.error(e)
    });

    // 2. Cargar productos y calcular stock bajo
    this.productoService.getProductos().subscribe({
      next: (res) => {
        // Contamos productos con stock <= 5
        this.productosBajoStock = res.filter(p => (p.stock || 0) <= 5).length;
      },
      error: (e) => console.error(e)
    });

    // 3. Cargar ventas y sumar total
    this.ventaService.getAll().subscribe({
      next: (res) => {
        // Total histórico de dinero
        this.totalVentas = res.reduce((acc, v) => acc + v.total, 0);
        
        // Ventas de HOY (Filtrado simple en frontend)
        const hoy = new Date().toISOString().split('T')[0]; // "2023-11-23"
        const ventasHoy = res.filter(v => v.fecha.startsWith(hoy));
        this.ventasDelDia = ventasHoy.reduce((acc, v) => acc + v.total, 0);
      },
      error: (e) => console.error(e)
    });
  }
}
