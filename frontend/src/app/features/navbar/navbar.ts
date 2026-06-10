import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button-component/button-component';
import { AuthService } from '../../core/services/auth.service'; // Asegúrate de importar tu servicio

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, ButtonComponent],
  templateUrl: './navbar.html'
})
export class Navbar {
  // Inyectamos el servicio que maneja toda la lógica compleja
  authService = inject(AuthService);

  /** Estado del menú hamburguesa para versión móvil */
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  async logout(): Promise<void> {
    this.closeMenu();
    await this.authService.logout(); // Ahora usamos el servicio centralizado
  }
}