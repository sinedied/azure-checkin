import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section>
      <mat-card class="card-button" routerLink="/admin">
        <mat-icon class="big-icon" inline>flight_takeoff</mat-icon>
        <h2>I'm an organizer</h2>
      </mat-card>
      <mat-card class="card-button" routerLink="/passenger">
        <mat-icon class="big-icon alt" inline>luggage</mat-icon>
        <h2>I'm a passenger</h2>
      </mat-card>
      <app-version></app-version>
    </section>
  `,
  styles: [
    `
      $color: #0ad;

      :host {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: #999;
        background-image: radial-gradient(circle at center, #999 0%, #444 100%);
        overflow: auto;
      }
      section {
        display: inline-flex;
        justify-content: center;
        flex-direction: column;
      }
      .mat-card.card-button {
        text-align: center;
        width: 10rem;
        height: 10rem;
        cursor: pointer;
      }
      .mat-card + .mat-card {
        margin: 4rem 0 0 0;
      }
      .mat-icon.big-icon {
        font-size: 6rem;
        line-height: 6rem;
        height: 6rem;
        margin: 0.5rem 0;
        color: transparent;
        background-image: linear-gradient(to right, adjust-hue($color, 10), adjust-hue($color, -10));
        background-clip: text;

        &.alt {
          background-image: linear-gradient(to right, $color, adjust-hue($color, -20));
        }
      }

      @media screen and (min-width: 768px) {
        section {
          font-size: 2.4em;
          flex-direction: row;
        }
        .mat-card + .mat-card {
          margin: 0 0 0 4rem;
        }
      }
    `,
  ],
})
export class HomeComponent {}
