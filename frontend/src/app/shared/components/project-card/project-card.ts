import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card-component/card-component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button-component/button-component';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, CardComponent, CommonModule, ButtonComponent],
  templateUrl: './project-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  @Input() proyecto!: any;

  getTecnologiasVisibles() {
    return this.proyecto.Tecnologias?.slice(0, 3) || [];
  }

  getTecnologiasRestantes() {
    return Math.max(0, (this.proyecto.Tecnologias?.length || 0) - 3);
  }
  
}
