import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ButtonComponent } from '../../../../shared/components/button-component/button-component';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { PROGRAMADOR_EMAILS } from '../../../../core/services/auth.service';
import { Solicitud } from '../../../../models/data.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private auth                = inject(Auth);
  private router              = inject(Router);
  private cdr                 = inject(ChangeDetectorRef);
  private solicitudesService  = inject(SolicitudesService);

  // --- Estado del listado ---
  solicitudes    = signal<Solicitud[]>([]);
  isLoading      = signal(true);
  isProgramador  = signal(false);

  // --- Estado del modal de detalle ---
  selectedSolicitud  = signal<Solicitud | null>(null);
  editEstado         = signal<Solicitud['estado']>('Pendiente');
  editObservacion    = signal<string>('');
  isSaving           = signal(false);
  saveSuccess        = signal(false);

  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      // Determinar rol: primero Custom Claims, luego email fallback
      let esProgramador = PROGRAMADOR_EMAILS.includes(user.email ?? '');
      try {
        const token = await user.getIdTokenResult(false);
        if (token.claims['role'] === 'programador') esProgramador = true;
      } catch { /* fallback a email */ }

      this.isProgramador.set(esProgramador);

      if (esProgramador) {
        const data = await this.solicitudesService.getSolicitudesPorProgramador(user.email!);
        this.solicitudes.set(data);
      } else {
        const data = await this.solicitudesService.getMisSolicitudes(user.uid);
        this.solicitudes.set(data);
      }

      this.isLoading.set(false);
      this.cdr.detectChanges();
    });
  }

  // ─── Modal ────────────────────────────────────────────────────────────────

  openDetalle(s: Solicitud): void {
    this.selectedSolicitud.set(s);
    this.editEstado.set(s.estado);
    this.editObservacion.set(s.observacion ?? '');
    this.saveSuccess.set(false);
  }

  closeDetalle(): void {
    this.selectedSolicitud.set(null);
  }

  async guardarCambios(): Promise<void> {
    const s = this.selectedSolicitud();
    if (!s?.id) return;

    this.isSaving.set(true);
    try {
      await this.solicitudesService.actualizarSolicitud(s.id, {
        estado:      this.editEstado(),
        observacion: this.editObservacion()
      });

      // Actualizar en memoria sin recargar desde Firestore
      this.solicitudes.update(list =>
        list.map(item =>
          item.id === s.id
            ? { ...item, estado: this.editEstado(), observacion: this.editObservacion() }
            : item
        )
      );

      // Actualizar el objeto seleccionado para que el modal refleje el cambio
      this.selectedSolicitud.update(prev =>
        prev ? { ...prev, estado: this.editEstado(), observacion: this.editObservacion() } : null
      );

      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 2500);
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('Error al guardar los cambios. Verifica tu conexión.');
    } finally {
      this.isSaving.set(false);
      this.cdr.detectChanges();
    }
  }

  // ─── Utilidades de UI ─────────────────────────────────────────────────────

  getEstadoClasses(estado: string): string {
    switch (estado) {
      case 'Aprobado':  return 'bg-green-500/10 text-green-400 border border-green-500/30';
      case 'Denegado':  return 'bg-red-500/10 text-red-400 border border-red-500/30';
      default:          return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30';
    }
  }

  getEstadoButtonClasses(estado: string, current: string): string {
    if (estado === current) {
      switch (estado) {
        case 'Aprobado':  return 'bg-green-500 text-white shadow-lg shadow-green-500/20';
        case 'Denegado':  return 'bg-red-500 text-white shadow-lg shadow-red-500/20';
        default:          return 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20';
      }
    }
    return 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500';
  }
}