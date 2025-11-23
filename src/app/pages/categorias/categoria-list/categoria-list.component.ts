import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoService, ICategoria } from '../../../services/catalogo.service';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css'
})
export class CategoriaListComponent {

  private api = inject(CatalogoService);

  categorias: ICategoria[] = [];
  filtradas: ICategoria[] = [];
  q = '';
  nueva = '';
  loading = false;
  errorMsg = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudo cargar categorías.';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const q = this.q.trim().toLowerCase();
    this.filtradas = !q ? this.categorias
      : this.categorias.filter(c => c.nombre.toLowerCase().includes(q));
  }

  add() {
    const nombre = this.nueva.trim();
    if (!nombre) return;
    this.loading = true;
    this.api.createCategoria(nombre).subscribe({
      next: (cat) => {
        this.categorias = [cat, ...this.categorias];
        this.nueva = '';
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.errorMsg = 'No se pudo crear la categoría.'; this.loading = false; }
    });
  }
}
