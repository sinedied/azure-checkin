import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-pass-card',
  template: `
    <mat-card>
      <h1>{{ eventName }}</h1>
      <p>Sorry, no more passes are available for this event.</p>
      <h2>:-(</h2>
      <p>Please contact the event organizer for more information.</p>
    </mat-card>
  `,
})
export class NoPassCardComponent {
  @Input() eventName: string = '';
}
