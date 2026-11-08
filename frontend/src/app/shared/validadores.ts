import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const cuposValidos: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  const maximo = Number(form.get('cupo_maximo')?.value);
  const reservados = Number(form.get('cupos_reservados')?.value);
  return reservados > maximo ? { cuposExcedidos: true } : null;
};

export const fechaNoPasada: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  const d = new Date();
  const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return control.value < hoy ? { fechaPasada: true } : null;
};