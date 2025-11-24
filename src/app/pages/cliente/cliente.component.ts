import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ICliente } from '../../interfaces/cliente.interface';
import { ClienteService } from '../../services/cliente.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit{
    public searchClienteName= '';
    public selectedClienteForModal: ICliente | null = null;

    p: number = 1;
    
    public allClientes: ICliente[] = [];
    public filteredClientes: ICliente[] = [];
    public clienteService = inject(ClienteService);
    public router = inject(Router);

    ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes():void {
    this.clienteService.getAll().subscribe({
      next: (clientes) => {
        this.allClientes = clientes;
        this.filteredClientes = clientes;
        this.p = 1;
        console.log('Clientes cargados:', this.allClientes);
      },
      error: (err) => {
        console.error('Error al cargar los clientes', err);
      }
    });
  }

  searchCliente(): void {
  if (!this.searchClienteName) {
    this.filteredClientes = this.allClientes;
    return;
  }

  const term = this.searchClienteName.toLowerCase().trim();

  this.filteredClientes = this.allClientes.filter(cliente =>
    cliente.nombres.toLowerCase().includes(term) ||
    cliente.dni.toLowerCase().includes(term)            // 🔹 también por DNI
  );
}

  goToNewCliente(): void{
    this.router.navigate(['/cliente/new'])
  }

   confirmDelete(id?: number, nombre?: string) {
    if (!id) return;
    Swal.fire({
      title: '¿Eliminar?',
      text: `Se eliminará a ${nombre ?? 'el cliente'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar'
    }).then(res => {
      if (res.isConfirmed) {
        this.clienteService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Registro eliminado', 'success');
            this.loadClientes();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }
}
