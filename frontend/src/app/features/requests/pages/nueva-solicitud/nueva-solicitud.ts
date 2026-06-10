import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ButtonComponent } from '../../../../shared/components/button-component/button-component';
import { ApiService } from '../../../../core/services/api';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

interface ProgramadorOption {
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent],
  templateUrl: './nueva-solicitud.html'
})
export class NuevaSolicitud implements OnInit {
  private auth               = inject(Auth);
  private router             = inject(Router);
  private apiService         = inject(ApiService);
  private solicitudesService = inject(SolicitudesService);

  // Datos del formulario
  form = {
    nombre:      '',
    correo:      '',
    proyecto:    '',
    descripcion: '',
    /** Nombre del programador seleccionado (bound al <select>) */
    programadorNombre: ''
  };

  /** Lista de programadores activos cargada desde Strapi */
  programadoresDisponibles: ProgramadorOption[] = [];
  loadingProgramadores = true;

  /** Feedback al usuario */
  isSubmitting = false;
  submitError:  string | null = null;

  ngOnInit(): void {
    // Pre-llenar correo si el usuario está autenticado
    const user = this.auth.currentUser;
    if (user?.email) {
      this.form.correo = user.email;
      this.form.nombre = user.displayName ?? '';
    }

    // Cargar programadores desde Strapi (solo los activos)
    this.apiService.getProgramadores().subscribe({
      next: (res) => {
        this.programadoresDisponibles = res.data
          .filter(p => p.Estado && p.Correo_contacto)
          .map(p => ({
            nombre: p.Nombre,
            email:  p.Correo_contacto
          }));
        this.loadingProgramadores = false;
      },
      error: (err) => {
        console.error('Error al cargar programadores:', err);
        // Fallback: datos hardcodeados en caso de que Strapi no responda
        this.programadoresDisponibles = [
          { nombre: 'Alexander Paucar',  email: 'alexpaucar.887@gmail.com' },
          { nombre: 'Esteban Hernandez', email: 'joehv33@gmail.com' }
        ];
        this.loadingProgramadores = false;
      }
    });
  }

  /**
   * Devuelve el email del programador actualmente seleccionado,
   * buscando en la lista cargada desde Strapi.
   */
  get selectedProgramadorEmail(): string {
    return this.programadoresDisponibles.find(
      p => p.nombre === this.form.programadorNombre
    )?.email ?? '';
  }

  async enviarSolicitud(): Promise<void> {
    this.submitError = null;
    const user = this.auth.currentUser;

    if (!user) {
      this.submitError = 'Sesión expirada. Por favor inicia sesión de nuevo.';
      return;
    }

    const programadorEmail = this.selectedProgramadorEmail;
    if (!programadorEmail) {
      this.submitError = 'No se pudo identificar al programador seleccionado.';
      return;
    }

    this.isSubmitting = true;
    try {
      await this.solicitudesService.crearSolicitud({
        nombre:           this.form.nombre,
        correo:           this.form.correo,
        proyecto:         this.form.proyecto,
        descripcion:      this.form.descripcion,
        programador:      this.form.programadorNombre,
        programadorEmail: programadorEmail,
        userId:           user.uid,
        userEmail:        user.email ?? '',
        fecha:            new Date().toLocaleDateString('es-EC'),
        estado:           'Pendiente'
      });

      this.router.navigate(['/requests']);
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      this.submitError = 'Error al enviar la solicitud. Intenta de nuevo.';
    } finally {
      this.isSubmitting = false;
    }
  }
}