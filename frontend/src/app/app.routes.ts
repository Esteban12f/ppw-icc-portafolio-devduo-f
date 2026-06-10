import { Routes } from '@angular/router';
import { Login } from './features/login/pages/login/login';
import { Profile } from './features/profile/pages/profile/profile';
import { Dashboard } from './features/requests/pages/dashboard/dashboard';
import { NuevaSolicitud } from './features/requests/pages/nueva-solicitud/nueva-solicitud';
import { DetalleProyectoComponent } from './features/proyectos/detalle-proyecto/detalle-proyecto';
import { Home } from './features/home/pages/home/home';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'requests',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'requests/nueva',
    component: NuevaSolicitud,
    canActivate: [authGuard]
  },

  {
    path: 'requests/editar/:id',
    component: NuevaSolicitud,
    canActivate: [authGuard]
  },

  { path: 'proyecto/:slug', 
    component: DetalleProyectoComponent 
  },

  {
    path: 'profile/:id',
    component: Profile
  },

  {
    path: '**',
    redirectTo: ''
  }
];