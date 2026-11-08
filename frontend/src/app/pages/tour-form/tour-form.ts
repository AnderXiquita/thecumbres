import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToursService } from '../../core/tours.service';
import { VolcanesService } from '../../core/volcanes.service';
import { Dificultad, EstadoTour } from '../../models/tour.model';
import { Volcan } from '../../models/volcan.model';
import { DIFICULTADES, ESTADOS } from '../../shared/etiquetas';
import { cuposValidos, fechaNoPasada } from '../../shared/validadores';

@Component({
  selector: 'app-tour-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tour-form.html',
})
export class TourForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toursService = inject(ToursService);
  private volcanesService = inject(VolcanesService);

  idEditar: number | null = null;
  volcanes: Volcan[] = [];
  dificultades = DIFICULTADES;
  estados = ESTADOS;
  error = '';
  guardando = false;

  form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      volcan_id: [0, [Validators.required, Validators.min(1)]],
      fecha_salida: ['', Validators.required],
      duracion_horas: [1, [Validators.required, Validators.min(1)]],
      dificultad: ['moderada' as Dificultad, Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      cupo_maximo: [10, [Validators.required, Validators.min(1)]],
      cupos_reservados: [0, [Validators.required, Validators.min(0)]],
      estado: ['programado' as EstadoTour, Validators.required],
      punto_encuentro: ['', Validators.required],
      guia: ['', Validators.required],
      descripcion: [''],
    },
    { validators: cuposValidos }
  );

  ngOnInit(): void {
    this.volcanesService.listar().subscribe((volcanes) => (this.volcanes = volcanes));

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idEditar = Number(id);
      this.toursService.obtener(this.idEditar).subscribe({
        next: (tour) => this.form.patchValue({ ...tour, descripcion: tour.descripcion ?? '' }),
        error: () => (this.error = 'No se encontro el tour'),
      });
    } else {
      this.form.controls.fecha_salida.addValidators(fechaNoPasada);
    }
  }

  invalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = '';
    const datos = this.form.getRawValue();

    const peticion = this.idEditar
      ? this.toursService.actualizar(this.idEditar, datos)
      : this.toursService.crear(datos);

    peticion.subscribe({
      next: (resp) => {
        const id = this.idEditar ?? (resp as { id: number }).id;
        this.router.navigate(['/tours', id]);
      },
      error: (err) => {
        this.error = err.error?.mensaje ?? 'No se pudo guardar el tour';
        this.guardando = false;
      },
    });
  }
}