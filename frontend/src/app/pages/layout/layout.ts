import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = this.auth.getUsuario();

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}