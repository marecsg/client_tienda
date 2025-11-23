export interface IProductoForm {
  nombre: string;
  descripcion: string;
  color: string;
  precio: number | null;
  categoriaId: number | null;
  tallaId: number | null;
}