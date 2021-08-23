import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <mat-card>
      <mat-card-header>
        <img mat-card-avatar src="./assets/azure.svg" alt="Azure Logo" />
        <mat-card-title class="text-ellipsis">
          {{ eventName || 'Admin login' }}
        </mat-card-title>
        <mat-card-subtitle>
          {{ eventName ? 'Online check-in' : 'Restricted access' }}
        </mat-card-subtitle>
      </mat-card-header>
      <ng-container *ngIf="id; else adminLogin">
        <p>
          To get your Azure Boarding Pass, please login with your GitHub
          account.<br />
          If you don't have a GitHub account, you need to create one first.
        </p>
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
          href="/.auth/login/github?post_login_redirect_uri={{
            getRedirectUrl()
          }}"
        >
          <mat-icon aria-hidden="true">login</mat-icon>
          Login with GitHub
        </a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .mat-card {
        max-width: calc(100vw - 20px);
        box-sizing: border-box;
      }
      .mat-card-avatar {
        border-radius: 0;
      }
      .mat-icon {
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class LoginComponent {
  @Input() id: string | null = null;
  @Input() eventName: string | null = null;

  getRedirectUrl(): string {
    return this.eventName ? `/event/${this.id}` : '/admin';
  }
}
