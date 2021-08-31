import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <mat-card>
      <mat-card-header>
        <img mat-card-avatar src="./assets/azure.svg" alt="Azure Logo" />
        <mat-card-title>Admin login</mat-card-title>
        <mat-card-subtitle>Restriced access</mat-card-subtitle>
      </mat-card-header>
      <p>You're not authorized to access this page.</p>
      <mat-card-actions align="end">
        <a mat-button href="/">Go back</a>
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
export class UnauthorizedComponent {}
