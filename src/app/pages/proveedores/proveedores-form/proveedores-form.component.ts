import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { IProveedor } from '../../../interfaces/proveedor.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proveedores-form.component.html',
  styleUrl: './proveedores-form.component.css'
})
export class ProveedoresFormComponent implements OnInit{
   private fb = inject(FormBuilder);
  private svc = inject(ProveedorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  private proveedorId: number | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      direccion: [''],
      telefono: ['', [Validators.pattern(/^\d{9}$/)]]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.proveedorId = +id;
        this.load(+id);
      }
    });
  }

  private load(id: number): void {
    this.svc.getById(id).subscribe({
      next: (p: IProveedor) => this.form.patchValue(p),
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la información del proveedor.', 'error');
        this.router.navigate(['/proveedores']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;

    const payload: IProveedor = this.form.value;

    if (this.isEditMode && this.proveedorId) {
      this.svc.update(this.proveedorId, payload).subscribe({
        next: (res) => {
          Swal.fire('¡Actualizado!', `Proveedor "${res.nombre}" actualizado.`, 'success');
          this.router.navigate(['/proveedores']);
        },
        error: (err) => this.handleErr(err),
        complete: () => this.isLoading = false
      });
    } else {
      this.svc.create(payload).subscribe({
        next: (res) => {
          Swal.fire('¡Registrado!', `Proveedor "${res.nombre}" registrado.`, 'success');
          this.router.navigate(['/proveedores']);
        },
        error: (err) => this.handleErr(err),
        complete: () => this.isLoading = false
      });
    }
  }

  private handleErr(err: any): void {
    const msg = err?.error?.error ?? 'Ocurrió un error al guardar el proveedor.';
    Swal.fire('Error', msg, 'error');
  }

  get f(){ return this.form.controls; }
}
