import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

/**
 * Guard que protege rutas que requieren autenticación.
 * Redirige al login si el usuario no está autenticado.
 *
 * Uso en app.routes.ts:
 *   { path: 'requests', component: Dashboard, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = () => {
  const auth   = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    // onAuthStateChanged resuelve en cuanto Firebase conoce el estado
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub(); // desuscribir inmediatamente tras primera respuesta
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};