import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToursService } from '../../core/tours.service';
import { EstadoTour, Tour } from '../../models/tour.model';
import { ESTADOS, infoEstado } from '../../shared/etiquetas';
import { DificultadIndicador } from '../../shared/dificultad/dificultad';

@Component({
  selector: 'app-tour-detalle',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, DificultadIndicador],
  templateUrl: './tour-detalle.html',
})
export class TourDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toursService = inject(ToursService);

  tour: Tour | null = null;
  error = '';
  estados = ESTADOS;
  infoEstado = infoEstado;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.toursService.obtener(id).subscribe({
      next: (tour) => (this.tour = tour),
      error: () => (this.error = 'No se encontro el tour'),
    });
  }

  get porcentajeOcupacion(): number {
    if (!this.tour) return 0;
    return Math.round((this.tour.cupos_reservados / this.tour.cupo_maximo) * 100);
  }

  cambiarEstado(estado: EstadoTour): void {
    if (!this.tour) return;
    this.toursService.cambiarEstado(this.tour.id, estado).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err.error?.mensaje ?? 'No se pudo cambiar el estado'),
    });
  }

  eliminar(): void {
    if (!this.tour || !confirm(`¿Eliminar el tour "${this.tour.nombre}"?`)) return;
    this.toursService.eliminar(this.tour.id).subscribe({
      next: () => this.router.navigate(['/tours']),
      error: (err) => alert(err.error?.mensaje ?? 'No se pudo eliminar el tour'),
    });
  }
}