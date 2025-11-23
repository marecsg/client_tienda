import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ClienteFormComponent } from './pages/cliente/cliente-form/cliente-form.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { ProductoFormComponent } from './pages/producto/producto-form/producto-form.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { TallasComponent } from './pages/tallas/tallas.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedoresFormComponent } from './pages/proveedores/proveedores-form/proveedores-form.component';
import { VentasFormComponent } from './pages/ventas/ventas-form/ventas-form.component';
import { VentasComponent } from './pages/ventas/ventas.component';


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'clientes', component: ClienteComponent },
      { path: 'clientes/new', component: ClienteFormComponent },
      { path: 'clientes/edit/:id', component: ClienteFormComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'productos', component: ProductoComponent },
      { path: 'productos/new', component: ProductoFormComponent },
      { path: 'productos/edit/:id', component: ProductoFormComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'proveedores/new', component: ProveedoresFormComponent },
      { path: 'proveedores/edit/:id', component: ProveedoresFormComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'ventas/new', component: VentasFormComponent },

      {
        path: 'categorias',
        loadComponent: () =>
          import('./pages/categorias/categoria-list/categoria-list.component')
            .then(m => m.CategoriaListComponent)
      },
      {
        path: 'tallas',
        loadComponent: () =>
          import('./pages/tallas/tallas.component')
            .then(m => m.TallasComponent)
      },
    ]
  }
];
