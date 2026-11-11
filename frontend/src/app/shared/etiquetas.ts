import { Dificultad, EstadoTour } from '../models/tour.model';

export const DIFICULTADES: { valor: Dificultad; texto: string; nivel: number }[] = [
  { valor: 'facil', texto: 'Fácil', nivel: 1 },
  { valor: 'moderada', texto: 'Moderada', nivel: 2 },
  { valor: 'dificil', texto: 'Difícil', nivel: 3 },
];

export const ESTADOS: { valor: EstadoTour; texto: string; clase: string }[] = [
  { valor: 'programado', texto: 'Programado', clase: 'estado-programado' },
  { valor: 'completo', texto: 'Completo', clase: 'estado-completo' },
  { valor: 'cancelado', texto: 'Cancelado', clase: 'estado-cancelado' },
  { valor: 'finalizado', texto: 'Finalizado', clase: 'estado-finalizado' },
];

export function infoDificultad(valor: string) {
  return DIFICULTADES.find((d) => d.valor === valor) ?? { valor, texto: valor, nivel: 0 };
}

export function infoEstado(valor: string) {
  return ESTADOS.find((e) => e.valor === valor) ?? { valor, texto: valor, clase: 'text-body' };
}