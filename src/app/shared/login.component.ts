import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <mat-card>
      <h1>{{ eventName || 'Admin login' }}</h1>
      <ng-container *ngIf="id; else adminLogin">
        <p>To get your Azure Pass, please login with your GitHub account.</p>
        <p>If you don't have a GitHub account, you need to create one first.</p>
      </ng-container>
      <ng-template #adminLogin>
        <p>Only events administrators can access this page.</p>
      </ng-template>
      <mat-card-actions align="end">
        <a *ngIf="id" mat-button href="https://github.com/join" target="_blank">
          Create GitHub account
        </a>
        <a
          mat-raised-button
          color="primary"
          href="/.auth/login/github?post_login_redirect_uri={{ getRedirectUrl() }}"
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
  @Input() eventName: string | null = null;

  getRedirectUrl(): string {
    return this.eventName ? `/event/${this.id}` : '/admin';
  }
}
