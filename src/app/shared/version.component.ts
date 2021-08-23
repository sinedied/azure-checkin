import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-version',
  template: `<p class="version">{{ version }}</p>`,
  styles: [
    `
      .version {
        opacity: 0.3;
        margin-top: 10px;
        text-align: center;
        font-size: 0.8rem;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    `,
  ],
})
export class VersionComponent {
  version: string = environment.version;
}
