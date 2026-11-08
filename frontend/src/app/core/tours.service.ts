import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { EstadoTour, FiltrosTour, ResumenTours, Tour, TourPayload } from '../models/tour.model';

@Injectable({ providedIn: 'root' })
export class ToursService {
  private http = inject(HttpClient);
  private url = `${API_URL}/tours`;

  listar(filtros: FiltrosTour = {}): Observable<Tour[]> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') {
        params = params.set(clave, String(valor));
      }
    });
    return this.http.get<Tour[]>(this.url, { params });
  }

  resumen(): Observable<ResumenTours> {
    return this.http.get<ResumenTours>(`${this.url}/resumen`);
  }

  obtener(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.url}/${id}`);
  }

  crear(tour: TourPayload): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.url, tour);
  }

  actualizar(id: number, tour: TourPayload): Observable<unknown> {
    return this.http.put(`${this.url}/${id}`, tour);
  }

  cambiarEstado(id: number, estado: EstadoTour): Observable<unknown> {
    return this.http.patch(`${this.url}/${id}/estado`, { estado });
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}