import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { VolcanesService } from '../../core/volcanes.service';
import { Volcan } from '../../models/volcan.model';

@Component({
  selector: 'app-volcanes',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './volcanes.html',
})
export class Volcanes implements OnInit {
  private fb = inject(FormBuilder);
  private volcanesService = inject(VolcanesService);

  volcanes: Volcan[] = [];
  volcanEditando: Volcan | null = null;
  mensaje = '';
  error = '';

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    departamento: ['', Validators.required],
    altura_m: [0, [Validators.required, Validators.min(1)]],
    descripcion: [''],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.volcanesService.listar().subscribe((volcanes) => (this.volcanes = volcanes));
  }

  invalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  editar(volcan: Volcan): void {
    this.volcanEditando = volcan;
    this.form.setValue({
      nombre: volcan.nombre,
      departamento: volcan.departamento,
      altura_m: volcan.altura_m,
      descripcion: volcan.descripcion ?? '',
    });
    this.mensaje = '';
    this.error = '';
  }

  cancelar(): void {
    this.volcanEditando = null;
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = this.form.getRawValue();
    const peticion = this.volcanEditando
      ? this.volcanesService.actualizar(this.volcanEditando.id, datos)
      : this.volcanesService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.mensaje = this.volcanEditando ? 'Volcan actualizado' : 'Volcan creado';
        this.error = '';
        this.cancelar();
        this.cargar();
      },
      error: (err) => {
        this.error = err.error?.mensaje ?? 'No se pudo guardar el volcan';
        this.mensaje = '';
      },
    });
  }

  eliminar(volcan: Volcan): void {
    if (!confirm(`¿Eliminar el volcan "${volcan.nombre}"?`)) return;

    this.volcanesService.eliminar(volcan.id).subscribe({
      next: () => {
        this.mensaje = 'Volcan eliminado';
        this.error = '';
        this.cargar();
      },
      error: (err) => {
        this.error = err.error?.mensaje ?? 'No se pudo eliminar el volcan';
        this.mensaje = '';
      },
    });
  }
}