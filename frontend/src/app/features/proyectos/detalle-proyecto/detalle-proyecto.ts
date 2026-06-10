import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location as NgLocation } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { CardComponent } from '../../../shared/components/card-component/card-component';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';

@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  templateUrl: './detalle-proyecto.html',
})
export class DetalleProyectoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(NgLocation);

  textoBoton: string = 'Volver a proyectos';
  proyecto: any = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.cargarProyecto(slug);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['back'] === 'perfil') {
        this.textoBoton = 'Volver a perfil';
      }
    });
  }

  cargarProyecto(slug: string) {
    this.api.getProyectoBySlug(slug).subscribe((res: any) => {
      // Según tu log, res.data[0] ya contiene todos los campos (Titulo, Imagen, etc.)
      if (res.data && res.data.length > 0) {
        this.proyecto = res.data[0];
        this.cdr.detectChanges();
      }
    });
  }

  obtenerTexto(bloques: any[]): string {
    if (!bloques || !Array.isArray(bloques)) return '';
    return bloques.map(b => b.children ? b.children.map((c: any) => c.text).join('') : '').join('\n');
  }

  regresar() {
    this.location.back();
  }
}