import { Dificultad, EstadoTour } from '../models/tour.model';

export const DIFICULTADES: { valor: Dificultad; texto: string; clase: string }[] = [
  { valor: 'facil', texto: 'Facil', clase: 'text-success' },
  { valor: 'moderada', texto: 'Moderada', clase: 'text-warning-emphasis' },
  { valor: 'dificil', texto: 'Dificil', clase: 'text-danger' },
];

export const ESTADOS: { valor: EstadoTour; texto: string; clase: string }[] = [
  { valor: 'programado', texto: 'Programado', clase: 'text-primary' },
  { valor: 'completo', texto: 'Completo', clase: 'text-info-emphasis' },
  { valor: 'cancelado', texto: 'Cancelado', clase: 'text-secondary' },
  { valor: 'finalizado', texto: 'Finalizado', clase: 'text-body-tertiary' },
];

export function infoDificultad(valor: string) {
  return DIFICULTADES.find((d) => d.valor === valor) ?? { valor, texto: valor, clase: 'text-body' };
}

export function infoEstado(valor: string) {
  return ESTADOS.find((e) => e.valor === valor) ?? { valor, texto: valor, clase: 'text-body' };
}