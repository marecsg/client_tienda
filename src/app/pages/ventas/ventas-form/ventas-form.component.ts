import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ICliente } from '../../../interfaces/cliente.interface';
import { IProducto } from '../../../interfaces/producto.interface';
import { DetalleVentaReq, VentaRequest, VentaResponse, VentaService } from '../../../services/venta.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProductoService } from '../../../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ventas-form.component.html',
  styleUrl: './ventas-form.component.css'
})
export class VentasFormComponent implements OnInit {

  clientes: ICliente[] = [];
  productos: IProducto[] = [];

  venta: VentaRequest = {
    clienteId: null,
    usuarioId: 1,
    fecha: null,
    detalles: []
  };

  ventaCreada: VentaResponse | null = null;

  correoEnvio = '';
  numeroEnvio = '';

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientes();
    this.loadProductos();
    this.addDetalle(); // empezamos con una fila
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  addDetalle(): void {
    const detalle: DetalleVentaReq = {
      productoId: 0 as any,
      cantidad: 1,
      precioUnitario: 0
    };
    this.venta.detalles.push(detalle);
  }

  removeDetalle(index: number): void {
    this.venta.detalles.splice(index, 1);
  }

  onProductoChange(detalle: DetalleVentaReq): void {
    const prod = this.productos.find(p => p.id === detalle.productoId);
    if (prod) {
      // asumimos que IProducto tiene 'precio'
      detalle.precioUnitario = prod.precio;
    }
  }

  get total(): number {
    return this.venta.detalles
      .reduce((acc, d) => acc + (d.cantidad * d.precioUnitario), 0);
  }

  guardarVenta(): void {
    if (!this.venta.clienteId) {
      Swal.fire('Aviso', 'Selecciona un cliente', 'warning');
      return;
    }

    if (!this.venta.detalles.length || this.venta.detalles.some(d => !d.productoId || d.cantidad <= 0)) {
      Swal.fire('Aviso', 'Completa los productos y cantidades', 'warning');
      return;
    }

    this.ventaService.create(this.venta).subscribe({
      next: (res) => {
        this.ventaCreada = res;
        Swal.fire('Éxito', 'Venta registrada correctamente', 'success');
        this.venta = {
          clienteId: null,
          usuarioId: 1,
          fecha: new Date().toISOString(),
          detalles: []
        };
        this.addDetalle();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', err.error?.message || 'No se pudo registrar la venta', 'error');
      }
    });
  }

  imprimirBoleta(): void {
    window.print(); // versión simple (imprime toda la página)
  }

  enviarComprobanteEmail(): void {
    if (!this.ventaCreada || !this.correoEnvio) {
      Swal.fire('Aviso', 'Primero registra la venta y coloca un correo', 'warning');
      return;
    }

    const asunto = `Comprobante de venta N° ${this.ventaCreada.id}`;
    const cuerpo = this.armarTextoComprobante(this.ventaCreada);

    const mailtoLink =
      `mailto:${encodeURIComponent(this.correoEnvio)}` +
      `?subject=${encodeURIComponent(asunto)}` +
      `&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = mailtoLink;
  }

  enviarComprobanteNumero(): void {
    if (!this.ventaCreada || !this.numeroEnvio) {
      Swal.fire('Aviso', 'Primero registra la venta y coloca un número', 'warning');
      return;
    }

    const mensaje = this.armarTextoComprobante(this.ventaCreada);

    const numeroLimpio = this.numeroEnvio.replace(/\D/g, '');

    // Asumo Perú (+51). Si ya incluyes 51 en el input, solo ajustamos.
    const waLink = `https://wa.me/51${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;

    window.open(waLink, '_blank');
  }

  volver(): void {
    this.router.navigate(['/ventas']);
  }

  getClienteDescripcion(id: number): string {
    const c = this.clientes.find(x => x.id === id);
    return c ? `${c.nombres} (DNI: ${c.dni})` : `Cliente ${id}`;
  }

  getProductoNombre(id: number): string {
    const p = this.productos.find(x => x.id === id);
    return p ? p.nombre : `Producto ${id}`;
  }

  private armarTextoComprobante(v: VentaResponse): string {
    const cliente = this.getClienteDescripcion(v.clienteId);  // ya lo tienes hecho
    const fecha = new Date(v.fecha).toLocaleString();

    let detalle = 'DETALLE DE LA COMPRA:\n';
    v.detalles.forEach(d => {
      const nombreProd = this.getProductoNombre(d.productoId); // ya lo tienes
      const importe = d.cantidad * d.precioUnitario;
      detalle += `- ${nombreProd} | Cant: ${d.cantidad} | PU: S/ ${d.precioUnitario.toFixed(2)} | Importe: S/ ${importe.toFixed(2)}\n`;
    });

    const totalLinea = `\nTOTAL: S/ ${v.total.toFixed(2)}\n`;

    return (
      `Comprobante de venta N° ${v.id}\n\n` +
      `Fecha: ${fecha}\n` +
      `Cliente: ${cliente}\n\n` +
      detalle +
      totalLinea +
      '\nGracias por su compra.'
    );
  }
}
