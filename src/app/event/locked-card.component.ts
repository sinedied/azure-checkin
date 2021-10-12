import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-locked-card',
  template: `
    <mat-card>
      <mat-card-header>
        <img mat-card-avatar src="./assets/azure.svg" alt="Azure Logo" />
        <mat-card-title class="text-ellipsis">
          {{ eventName }}
        </mat-card-title>
        <mat-card-subtitle>Check-in error</mat-card-subtitle>
      </mat-card-header>
      <p class="sad">
        <b>Sorry, this flight has already departed and cannot be boarded anymore.</b>
        <mat-icon inline>sentiment_very_dissatisfied</mat-icon>
      </p>
    </mat-card>
  `,
  styles: [
    `
      @use '~@angular/material' as mat;
      @use './src/theme' as *;

      .sad {
        > .mat-icon {
          font-size: 3em;
          line-height: 1em;
          vertical-align: middle;
          margin-left: 0.5rem;
        }
      }
      .mat-card-avatar {
        border-radius: 0;
      }
    `,
  ],
})
export class LockedCardComponent {
  @Input() eventName: string = '';
}
