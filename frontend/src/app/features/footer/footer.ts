import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterDev } from '../../shared/components/footer-dev/footer-dev';
@Component({
  selector: 'app-footer',
  imports: [RouterLink, FooterDev],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
