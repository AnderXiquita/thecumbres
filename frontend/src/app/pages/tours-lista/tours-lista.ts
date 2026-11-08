import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToursService } from '../../core/tours.service';
import { VolcanesService } from '../../core/volcanes.service';
import { FiltrosTour, ResumenTours, Tour } from '../../models/tour.model';
import { Volcan } from '../../models/volcan.model';
import { DIFICULTADES, ESTADOS, infoDificultad, infoEstado } from '../../shared/etiquetas';

@Component({
  selector: 'app-tours-lista',
  imports: [FormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './tours-lista.html',
})
export class ToursLista implements OnInit {
  private toursService = inject(ToursService);
  private volcanesService = inject(VolcanesService);

  tours: Tour[] = [];
  volcanes: Volcan[] = [];
  resumen: ResumenTours | null = null;
  cargando = true;
  error = '';

  filtros: FiltrosTour = { buscar: '', volcan_id: '', dificultad: '', estado: '' };

  dificultades = DIFICULTADES;
  estados = ESTADOS;
  infoDificultad = infoDificultad;
  infoEstado = infoEstado;

  ngOnInit(): void {
    this.volcanesService.listar().subscribe((volcanes) => (this.volcanes = volcanes));
    this.cargarResumen();
    this.buscar();
  }

  buscar(): void {
    this.cargando = true;
    this.error = '';
    this.toursService.listar(this.filtros).subscribe({
      next: (tours) => {
        this.tours = tours;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los tours';
        this.cargando = false;
      },
    });
  }

  cargarResumen(): void {
    this.toursService.resumen().subscribe((resumen) => (this.resumen = resumen));
  }

  limpiar(): void {
    this.filtros = { buscar: '', volcan_id: '', dificultad: '', estado: '' };
    this.buscar();
  }

  eliminar(tour: Tour): void {
    if (!confirm(`¿Eliminar el tour "${tour.nombre}"?`)) return;

    this.toursService.eliminar(tour.id).subscribe({
      next: () => {
        this.buscar();
        this.cargarResumen();
      },
      error: (err) => alert(err.error?.mensaje ?? 'No se pudo eliminar el tour'),
    });
  }
}