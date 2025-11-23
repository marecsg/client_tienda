export interface IProducto {
 id: number;
  nombre: string;
  descripcion: string;

  categoriaId: number | null;
  categoriaNombre: string | null;

  tallaId: number | null;
  tallaNombre: string | null;

  color: string;
  precio: number;
  imageUrl?: string | null;

  stock?: number | null; 
}

