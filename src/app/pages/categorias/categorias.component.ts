import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService, ICategoria } from '../../services/catalogo.service';

@Component({
  standalone: true,
  selector: 'app-categorias',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Categorías</h3>
      <div class="input-group" style="max-width: 360px;">
        <input class="form-control" [(ngModel)]="nuevoNombre" placeholder="Nueva categoría">
        <button class="btn btn-primary" (click)="crear()" [disabled]="!nuevoNombre.trim()">Agregar</button>
      </div>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <table class="table mb-0">
          <thead class="table-dark"><tr><th>#</th><th>Nombre</th></tr></thead>
          <tbody>
            <tr *ngFor="let c of categorias; let i = index">
              <td>{{ i+1 }}</td>
              <td>{{ c.nombre }}</td>
            </tr>
            <tr *ngIf="categorias.length===0"><td colspan="2" class="text-center p-3">Sin datos</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `
})
export class CategoriasComponent {
  private svc = inject(CatalogoService);
  categorias: ICategoria[] = [];
  nuevoNombre = '';

  ngOnInit(){ this.load(); }
  load(){ this.svc.getCategorias().subscribe(r => this.categorias = r); }
  crear(){
    const n = this.nuevoNombre.trim();
    if(!n) return;
    this.svc.createCategoria(n).subscribe(_ => { this.nuevoNombre=''; this.load(); });
  }
}