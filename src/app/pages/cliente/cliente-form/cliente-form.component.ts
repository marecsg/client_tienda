import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit{
  clienteForm!: FormGroup;
  isLoading = false;

  isEditMode = false;
  private clienteId: number | null = null;

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
  this.initializeForm();
     this.checkMode();
  }

  checkMode(): void{
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id) {
        this.isEditMode = true;
        this.clienteId = +id;
        this.loadClienteData(this.clienteId);
      }
    })
  }

  loadClienteData(id:number): void {
    this.clienteService.getById(id).subscribe({
      next: (response) => {
        console.log('Cliente recibido desde el backend:', response);

        const cliente = Array.isArray(response) ? response[0] : response;

        if(!cliente) {
          Swal.fire('Error', 'No se encontró informacion del cliente.', 'error');
          this.router.navigate(['/clientes']);
          return;
        }

        this.clienteForm.patchValue({
          nombres: cliente.nombres,
          dni: cliente.dni,
          direccion: cliente.direccion,
          telefono: cliente.telefono
        });

        console.log('📋 Formulario cargado con:', this.clienteForm.value);
      },
      error: (err) =>{
        console.error('Error al registrar el cliente:', err);
        Swal.fire('Error', 'No se pudo cargar la informacion del cliente.', 'error');
        this.router.navigate(['/clientes']);
      }
    });
  }

  initializeForm(): void {
    this.clienteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.maxLength(9)]],
    });
  }

  onSubmit(): void {
    if(this.clienteForm.invalid){
      this.clienteForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const clienteData = this.clienteForm.value;

    if(this.isEditMode && this.clienteId){
      this.clienteService.update(this.clienteId, clienteData).subscribe({
        next: (update) => {
          Swal.fire('¡Actualizado!', `El cliente "${update.nombres}" ha sido actualizado.`, 'success')
          this.router.navigate(['/clientes']);
        },
        error: (err) => this.handleError(err),
        complete: () => this.isLoading = false
      });
    } else{
      this.clienteService.create(clienteData).subscribe({
        next: (create) => { 
          Swal.fire('¡Registrado!', `El cliente "${create.nombres}" ha sido registrado.`, 'success')
          this.router.navigate(['/clientes']);
        },
        error: (err) => this.handleError(err),
        complete: () => this.isLoading = false
      });
    }
  }

  private handleError(err: any): void {
    console.error('Error en la operación:', err);
    Swal.fire('Error', 'Ocurrió un error al guardar el cliente.', 'error');
    this.isLoading = false;
  }

}
