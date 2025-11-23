import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoService, ITalla } from '../../services/catalogo.service';

@Component({
  selector: 'app-tallas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tallas.component.html',
  styleUrl: './tallas.component.css'
})
export class TallasComponent {

    private api = inject(CatalogoService);

  tallas: ITalla[] = [];
  filtradas: ITalla[] = [];
  q = '';
  nueva = '';
  loading = false;
  errorMsg = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getTallas().subscribe({
      next: (data) => {
        this.tallas = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.errorMsg = 'No se pudo cargar tallas.'; this.loading = false; }
    });
  }

  applyFilter() {
    const q = this.q.trim().toLowerCase();
    this.filtradas = !q ? this.tallas
      : this.tallas.filter(t => t.nombre.toLowerCase().includes(q));
  }

  add() {
    const nombre = this.nueva.trim();
    if (!nombre) return;
    this.loading = true;
    this.api.createTalla(nombre).subscribe({
      next: (t) => { this.tallas = [t, ...this.tallas]; this.nueva=''; this.applyFilter(); this.loading=false; },
      error: () => { this.errorMsg = 'No se pudo crear la talla.'; this.loading=false; }
    });
  }

}
