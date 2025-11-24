import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IProveedor } from '../../../interfaces/proveedor.interface';
import { IProducto } from '../../../interfaces/producto.interface';
import { CompraRequest, CompraService, DetalleCompraReq } from '../../../services/compra.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { ProductoService } from '../../../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './compras-form.component.html',
  styleUrl: './compras-form.component.css'
})
export class ComprasFormComponent implements OnInit{

   proveedores: IProveedor[] = [];
  productos: IProducto[] = [];

  // Modelo de la nueva compra
  compra: CompraRequest = {
    proveedorId: null,
    usuarioId: 1, // Usuario fijo por ahora (ADMIN)
    fecha: null,
    detalles: []
  };

  constructor(
    private compraService: CompraService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProveedores();
    this.loadProductos();
    this.addDetalle(); // Agregar una fila vacía al iniciar
  }

  loadProveedores() {
    this.proveedorService.getAll().subscribe(data => this.proveedores = data);
  }

  loadProductos() {
    this.productoService.getProductos().subscribe(data => this.productos = data);
  }

  addDetalle() {
    this.compra.detalles.push({
      productoId: 0 as any,
      cantidad: 1,
      precioUnitario: 0
    });
  }

  removeDetalle(index: number) {
    if (this.compra.detalles.length > 1) {
      this.compra.detalles.splice(index, 1);
    }
  }

  // Al seleccionar producto, sugerimos su precio actual (opcional)
  onProductoChange(item: DetalleCompraReq) {
    const p = this.productos.find(x => x.id === item.productoId);
    if (p) {
      // Aquí podrías poner el precio de costo si lo tuvieras, 
      // por defecto ponemos el de venta como referencia o 0
      item.precioUnitario = 0; 
    }
  }

  get totalEstimado(): number {
    return this.compra.detalles.reduce((acc, d) => acc + (d.cantidad * d.precioUnitario), 0);
  }

  guardarCompra() {
    // Validaciones básicas
    if (!this.compra.proveedorId) {
      Swal.fire('Atención', 'Debes seleccionar un proveedor', 'warning');
      return;
    }
    if (this.compra.detalles.some(d => !d.productoId || d.cantidad <= 0 || d.precioUnitario < 0)) {
      Swal.fire('Atención', 'Revisa los productos, cantidades y precios', 'warning');
      return;
    }

    // Enviar al backend
    this.compraService.create(this.compra).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Compra Registrada',
          text: `Se generó el ingreso #${res.id} y se actualizó el stock.`,
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/compras']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo registrar la compra', 'error');
      }
    });
  }

  volver() {
    this.router.navigate(['/compras']);
  }
}
