import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-logout',
  template: `
    <a
      mat-icon-button
      color="accent"
      href="/.auth/logout?post_logout_redirect_uri={{ redirectUrl }}"
      aria-label="Logout"
      matTooltip="Logout"
    >
      <mat-icon>logout</mat-icon>
    </a>
  `,
  styles: [
    `
      :host(:not(.inline)) {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      :host(.inline) .mat-icon-button {
        color: #fff;
      }
    `,
  ],
})
export class LogoutComponent {
  @Input() redirectUrl: string | null = '/';
  @Input() @HostBinding('class.inline') inline?: string;
}
