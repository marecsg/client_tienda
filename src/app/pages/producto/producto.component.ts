import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IProducto } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

declare var bootstrap: any;

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit{
  searchProductoName = '';
  selectedProductoForModal: IProducto | null = null;
  private imageModal: any;

  p: number = 1;

  allProductos: IProducto[] = [];
  filteredProductos: IProducto[] = [];

  private productoService = inject(ProductoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadProductos();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('imagePreviewModal');
    if (modalElement) this.imageModal = new bootstrap.Modal(modalElement);
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        // Asegura que 'stock' sea numérico y 'imageUrl' string/null
        this.allProductos = (productos ?? []).map(p => ({
          ...p,
          stock: Number(p.stock ?? 0),
          imageUrl: p.imageUrl ?? null
        }));
        this.filteredProductos = this.allProductos;
        // console.log('Productos cargados:', this.allProductos);
      },
      error: (err) => console.error('Error al cargar los productos:', err)
    });
  }

  searchProducto(): void {
    const q = this.searchProductoName.trim().toLowerCase();
    if (!q) {
      this.filteredProductos = this.allProductos;
      return;
    }
    this.filteredProductos = this.allProductos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoriaNombre?.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );
  }

  goToNewProducto(): void {
    this.router.navigate(['/productos/new']);
  }

  onFileSelected(event: Event, productoId: number): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  this.productoService.uploadProductoImage(productoId, file).subscribe({
    next: (resp) => {
      const ok = resp.status >= 200 && resp.status < 300 && !!resp.body;
      if (!ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const updated = resp.body!;
      const upd: IProducto = {
        ...updated,
        stock: Number((updated as any).stock ?? 0),
        imageUrl: (updated as any).imageUrl ?? null
      };

      // actualiza en ambas listas
      const iAll = this.allProductos.findIndex(p => p.id === productoId);
      if (iAll !== -1) this.allProductos[iAll] = upd;
      const iFilt = this.filteredProductos.findIndex(p => p.id === productoId);
      if (iFilt !== -1) this.filteredProductos[iFilt] = upd;

      input.value = '';
      Swal.fire({ icon: 'success', title: 'Imagen subida', timer: 1200, showConfirmButton: false });
    },
    error: (err) => {
      console.error('Upload error:', err);
      input.value = '';
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la imagen.' });
    }
  });
}
  openImageModal(producto: IProducto): void {
    this.selectedProductoForModal = producto;
    if (this.imageModal) this.imageModal.show();
  }

  deleteProducto(productoId: number, productoName: string): void {
    Swal.fire({
      title: '¿Eliminar?',
      text: `Se eliminará "${productoName}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;
      this.productoService.deleteProducto(productoId).subscribe({
        next: () => {
          this.allProductos = this.allProductos.filter(p => p.id !== productoId);
          this.filteredProductos = this.filteredProductos.filter(p => p.id !== productoId);
          Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1200, showConfirmButton: false });
        },
        error: (err) => {
          console.error(`Error al eliminar producto ${productoId}:`, err);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el producto.' });
        }
      });
    });
  }

  trackById = (_: number, item: IProducto) => item.id;
}
