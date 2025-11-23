import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import Swal from 'sweetalert2';
import { CatalogoService, ICategoria, ITalla } from '../../../services/catalogo.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit{
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoSvc = inject(ProductoService);
  private catalogoSvc = inject(CatalogoService);

  form!: FormGroup;
  isEditMode = false;
  id: number | null = null;
  isLoading = false;

  categorias: ICategoria[] = [];
  tallas: ITalla[] = [];

  ngOnInit(){
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      color: ['', [Validators.required]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      categoriaId: [null, [Validators.required]],
      tallaId: [null, [Validators.required]]
    });

    // catálogo
    this.catalogoSvc.getCategorias().subscribe(r => this.categorias = r);
    this.catalogoSvc.getTallas().subscribe(r => this.tallas = r);

    // modo edición
    this.route.paramMap.subscribe(p => {
      const s = p.get('id');
      if(s){
        this.isEditMode = true;
        this.id = +s;
        this.cargar(this.id);
      }
    });
  }

  cargar(id: number){
    this.productoSvc.getProductoById(id).subscribe({
      next: (p: any) => {
        this.form.patchValue({
          nombre: p.nombre,
          descripcion: p.descripcion,
          color: p.color,
          precio: p.precio,
          categoriaId: p.categoriaId,
          tallaId: p.tallaId
        });
      },
      error: _ => Swal.fire('Error','No se pudo cargar la información del producto.','error')
    });
  }

  submit(){
    if(this.form.invalid){ this.form.markAllAsTouched(); return; }
    this.isLoading = true;

    if(this.isEditMode && this.id){
      this.productoSvc.updateProducto(this.id, this.form.value).subscribe({
        next: (res) => { Swal.fire('OK','Producto actualizado','success'); this.router.navigate(['/productos']); },
        error: _ => { this.isLoading=false; Swal.fire('Error','No se pudo actualizar','error'); },
        complete: () => this.isLoading=false
      });
    }else{
      this.productoSvc.createProducto(this.form.value).subscribe({
        next: _ => { Swal.fire('OK','Producto registrado','success'); this.router.navigate(['/productos']); },
        error: _ => { this.isLoading=false; Swal.fire('Error','No se pudo registrar','error'); },
        complete: () => this.isLoading=false
      });
    }
  }
}
