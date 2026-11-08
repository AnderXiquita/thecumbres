export interface Volcan {
  id: number;
  nombre: string;
  departamento: string;
  altura_m: number;
  descripcion: string | null;
  total_tours?: number;
}