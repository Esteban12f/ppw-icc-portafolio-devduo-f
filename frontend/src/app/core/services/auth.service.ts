import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

/**
 * Correos de los programadores del portafolio.
 * Deben coincidir exactamente con los valores en Strapi (campo Correo_contacto)
 * y con los correos registrados en Firebase Authentication.
 */
export const PROGRAMADOR_EMAILS: string[] = [
  'joehv33@gmail.com',
  'alexpaucar.887@gmail.com'
];

export type UserRole = 'programador' | 'externo' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  // --- Estado reactivo con Signals ---
  currentUser = signal<User | null>(null);
  userRole    = signal<UserRole>(null);
  isLoading   = signal<boolean>(true);

  // Computadas derivadas
  readonly isProgramador = computed(() => this.userRole() === 'programador');
  readonly isLoggedIn    = computed(() => this.currentUser() !== null);

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser.set(user);
      if (user) {
        await this.resolveRole(user);
      } else {
        this.userRole.set(null);
      }
      this.isLoading.set(false);
    });
  }

  /**
   * Determina el rol del usuario:
   * 1. Intenta leer Custom Claim 'role' del token JWT.
   * 2. Fallback: comprueba si el email está en PROGRAMADOR_EMAILS.
   *
   * Para asignar Custom Claims usa el script /scripts/set-custom-claims.js
   */
  async resolveRole(user: User): Promise<void> {
    try {
      const tokenResult = await user.getIdTokenResult(false); // sin forzar refresh
      const hasClaimRole = tokenResult.claims['role'] === 'programador';
      const hasEmailRole = PROGRAMADOR_EMAILS.includes(user.email ?? '');
      this.userRole.set((hasClaimRole || hasEmailRole) ? 'programador' : 'externo');
    } catch {
      // Si falla la lectura del token, usar solo email
      this.userRole.set(
        PROGRAMADOR_EMAILS.includes(user.email ?? '') ? 'programador' : 'externo'
      );
    }
  }

  /**
   * Fuerza un refresh del token para recargar los Custom Claims.
   * Útil después de establecer claims vía Admin SDK.
   */
  async refreshRole(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await user.getIdToken(true); // fuerza refresh
    await this.resolveRole(user);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser.set(null);
    this.userRole.set(null);
    this.router.navigate(['/']);
  }
}