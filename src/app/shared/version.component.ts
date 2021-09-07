import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-version',
  template: `
    <p class="version">
      Made with ♡ by
      <a href="https://twitter.com/sinedied" target="_blank">@sinedied</a>
      — v{{ version }}
    </p>
  `,
  styles: [
    `
      .version {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        opacity: 0.5;
        margin-top: 10px;
        text-align: center;
        font-size: 0.8rem;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        z-index: 0;
      }
      .version,
      a {
        color: #fff;
      }
    `,
  ],
})
export class VersionComponent {
  version: string = environment.version!;
}
