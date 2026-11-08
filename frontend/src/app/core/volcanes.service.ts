import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Volcan } from '../models/volcan.model';

@Injectable({ providedIn: 'root' })
export class VolcanesService {
  private http = inject(HttpClient);
  private url = `${API_URL}/volcanes`;

  listar(): Observable<Volcan[]> {
    return this.http.get<Volcan[]>(this.url);
  }

  crear(volcan: Partial<Volcan>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.url, volcan);
  }

  actualizar(id: number, volcan: Partial<Volcan>): Observable<unknown> {
    return this.http.put(`${this.url}/${id}`, volcan);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}