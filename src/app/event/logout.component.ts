import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logout',
  template: `
    <a
      mat-icon-button
      href="/.auth/logout?post_logout_redirect_uri=/event/{{ id }}"
      aria-label="Logout"
      matTooltip="Logout"
    >
      <mat-icon>logout</mat-icon>
    </a>
  `,
  styles: [
    `
      :host {
        position: absolute;
        right: 20px;
        top: 20px;
      }
    `,
  ],
})
export class LogoutComponent {
  @Input() id: string | null = null;
}
