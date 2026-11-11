import { Component, Input } from '@angular/core';
import { Dificultad } from '../../models/tour.model';
import { infoDificultad } from '../etiquetas';

@Component({
  selector: 'app-dificultad',
  templateUrl: './dificultad.html',
  styleUrl: './dificultad.css',
})
export class DificultadIndicador {
  @Input({ required: true }) valor!: Dificultad;
  @Input() conTexto = false;

  niveles = [1, 2, 3];

  get info() {
    return infoDificultad(this.valor);
  }
}