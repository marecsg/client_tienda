import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IProveedor } from '../../interfaces/proveedor.interface';
import { ProveedorService } from '../../services/proveedor.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit{
  public searchProveedorName= '';
  public selectedProveedorForModal: IProveedor | null = null;
      
      public allProveedores: IProveedor[] = [];
      public filteredProveedores: IProveedor[] = [];
      public proveedorService = inject(ProveedorService);
      public router = inject(Router);

      p: number = 1;
  
      ngOnInit(): void {
      this.loadProveedores();
    }
  
    loadProveedores():void {
      this.proveedorService.getAll().subscribe({
        next: (proveedores) => {
          this.allProveedores = proveedores;
          this.filteredProveedores = proveedores;
          console.log('Proveedores cargados:', this.allProveedores);
        },
        error: (err) => {
          console.error('Error al cargar los proveedores', err);
        }
      });
    }
  
    searchProveedor(): void {
      if (!this.searchProveedorName) {
        this.filteredProveedores = this.allProveedores;
      return;
     }

    const term = this.searchProveedorName.toLowerCase().trim();

    this.filteredProveedores = this.allProveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(term) ||
    proveedor.ruc.toLowerCase().includes(term)          
  );
}
  
    goToNewCliente(): void{
      this.router.navigate(['/proveedores/new'])
    }
  
     confirmDelete(id?: number, nombre?: string) {
      if (!id) return;
      Swal.fire({
        title: '¿Eliminar?',
        text: `Se eliminará a ${nombre ?? 'el proveedor'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar'
      }).then(res => {
        if (res.isConfirmed) {
          this.proveedorService.delete(id).subscribe({
            next: () => {
              Swal.fire('Eliminado', 'Registro eliminado', 'success');
              this.loadProveedores();
            },
            error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
          });
        }
      });
    }
}
