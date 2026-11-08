import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { ToursLista } from './pages/tours-lista/tours-lista';
import { TourForm } from './pages/tour-form/tour-form';
import { TourDetalle } from './pages/tour-detalle/tour-detalle';
import { Volcanes } from './pages/volcanes/volcanes';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tours', pathMatch: 'full' },
      { path: 'tours', component: ToursLista },
      { path: 'tours/nuevo', component: TourForm },
      { path: 'tours/:id', component: TourDetalle },
      { path: 'tours/:id/editar', component: TourForm },
      { path: 'volcanes', component: Volcanes },
    ],
  },
  { path: '**', redirectTo: '' },
];