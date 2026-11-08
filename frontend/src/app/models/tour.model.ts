export type Dificultad = 'facil' | 'moderada' | 'dificil';
export type EstadoTour = 'programado' | 'completo' | 'cancelado' | 'finalizado';

export interface Tour {
  id: number;
  nombre: string;
  volcan_id: number;
  fecha_salida: string;
  duracion_horas: number;
  dificultad: Dificultad;
  precio: number;
  cupo_maximo: number;
  cupos_reservados: number;
  cupos_disponibles: number;
  estado: EstadoTour;
  punto_encuentro: string;
  guia: string;
  descripcion: string | null;
  volcan_nombre: string;
  volcan_departamento?: string;
  volcan_altura_m?: number;
}

export type TourPayload = Omit<
  Tour,
  'id' | 'cupos_disponibles' | 'volcan_nombre' | 'volcan_departamento' | 'volcan_altura_m'
>;

export interface FiltrosTour {
  buscar?: string;
  volcan_id?: number | string;
  dificultad?: string;
  estado?: string;
}

export interface ResumenTours {
  total: number;
  proximos: number;
  cupos_disponibles: number;
  por_volcan: { nombre: string; total: number }[];
}