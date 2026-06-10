import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 1. Agregamos ChangeDetectorRef
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api';
import { DevCard } from '../../../../shared/components/dev-card/dev-card';
import { ProjectCard } from '../../../../shared/components/project-card/project-card';
import { ButtonComponent } from '../../../../shared/components/button-component/button-component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectCard, ButtonComponent],
})
export class Profile implements OnInit {
  programador: any = null;
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef); // 2. Inyectamos para forzar actualización

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('id');
      if (slug) {
        this.cargarProgramador(slug);
      }
    });
  }

  cargarProgramador(slug: string) {
    // Es vital que tu servicio incluya populate=* para traer los proyectos y fotos
    this.api.getProgramadorBySlug(slug).subscribe({
      next: (res) => {
        console.log('Datos recibidos del perfil:', res);
        if (res.data && res.data.length > 0) {
          this.programador = res.data[0];
          this.cdr.detectChanges(); // 3. Forzamos el pintado del HTML
        } else {
          this.programador = null;
        }
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  obtenerTextoCompleto(bloques: any[]): string {
    if (!bloques || !Array.isArray(bloques)) return '';

    return bloques
      .map(bloque => {
        if (bloque.children) {
          return bloque.children.map((child: any) => child.text).join('');
        }
        return '';
      })
      .join('\n');
  }
}