import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-pass-card',
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
        <b>Sorry, this flight is fully booked, there's no seat available.</b>
        <mat-icon inline>sentiment_very_dissatisfied</mat-icon>
      </p>
      <p>Please contact the event organizer for more information.</p>
    </mat-card>
  `,
  styles: [
    `
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
      .error {
        color: red;
      }
    `,
  ],
})
export class NoPassCardComponent {
  @Input() eventName: string = '';
}
