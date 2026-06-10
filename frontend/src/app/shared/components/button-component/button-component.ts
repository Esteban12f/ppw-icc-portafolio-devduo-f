import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() type: string = 'button';

  getVariantClasses() {
    return this.variant === 'primary' 
      ? 'bg-linear-to-r from-blue-600 to-cyan-500 hover:scale-105 text-white' 
      : 'bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300';
  }
}
