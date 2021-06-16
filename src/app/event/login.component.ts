import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <mat-card>
      <p>To get your Azure Pass, please login with your GitHub account.</p>
      <p>If you don't have a GitHub account, you need to create one first.</p>
      <mat-card-actions>
        <a mat-button href="https://github.com/join" target="_blank">
          Create GitHub account
        </a>
        <a
          mat-raised-button
          color="primary"
          href="/.auth/login/github?post_login_redirect_uri=/event/{{ id }}"
        >
          <mat-icon aria-hidden="true">login</mat-icon>
          Login with GitHub
        </a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [],
})
export class LoginComponent {
  @Input() id: string | null = null;
}
