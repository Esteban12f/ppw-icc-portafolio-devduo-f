import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer-dev',
  imports: [CommonModule],
  templateUrl: './footer-dev.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterDev {
  @Input() name!: string;
  @Input() email!: string;
  @Input() github!: string;
  @Input() linkedin!: string;
}
