import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, Observable, take, BehaviorSubject, combineLatest } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button-component/button-component';
import { ProjectCard } from '../../../../shared/components/project-card/project-card';
import { DevCard } from '../../../../shared/components/dev-card/dev-card';
import { ApiService } from '../../../../core/services/api';
import { Programador, Proyecto } from '../../../../models/data.models';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonComponent, ProjectCard, DevCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private api = inject(ApiService);
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = user(this.auth);

  // Variables reactivas
  proyectos$: Observable<Proyecto[]> = this.api.getProyectosDestacados().pipe(map(res => res.data));
  programadores$: Observable<Programador[]> = this.api.getProgramadores().pipe(map(res => res.data));

  // Estados de filtro
  busqueda$ = new BehaviorSubject<string>('');
  filtroTecnologia$ = new BehaviorSubject<string | null>(null);

  ngOnInit() { }

  // Combinamos el stream de proyectos con los filtros para que sea "en vivo"
  proyectosFiltrados$ = combineLatest([this.proyectos$, this.busqueda$, this.filtroTecnologia$]).pipe(
    map(([proyectos, busqueda, filtro]) => {
      return proyectos.filter(p => {
        const busca = busqueda.toLowerCase();
        const coincideBusqueda = p.Titulo.toLowerCase().includes(busca) ||
          p.Tecnologias?.some(t => t.toLowerCase().includes(busca));
        const coincideTecnologia = !filtro || p.Tecnologias?.includes(filtro);
        return coincideBusqueda && coincideTecnologia;
      });
    })
  );

  // Para obtener tecnologías únicas (esto se puede calcular al recibir los datos)
  getTecnologiasUnicas$(proyectos: Proyecto[]): string[] {
    const techs = new Set<string>();
    proyectos.forEach(p => p.Tecnologias?.forEach(t => techs.add(t)));
    return ['Todas', ...Array.from(techs).sort()];
  }

  // Métodos auxiliares

  getTecnologiasOcultas(tecnologias: string[]): number {
    return (tecnologias && tecnologias.length > 3) ? tecnologias.length - 3 : 0;
  }

  handleSolicitudClick(rutaDestino: string) {
    this.user$.pipe(take(1)).subscribe(currentUser => {
      this.router.navigate([currentUser ? rutaDestino : '/login']);
    });
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}