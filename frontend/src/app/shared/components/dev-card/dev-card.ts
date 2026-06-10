import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonComponent } from '../button-component/button-component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dev-card',
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './dev-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevCard {
  @Input({ required: true }) dev!: any;
}
