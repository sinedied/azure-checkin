import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { EventService } from './shared/event.service';

@Component({
  selector: 'app-home',
  template: `
    <section>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Azure check-in</mat-card-title>
          <mat-card-subtitle>For new passengers</mat-card-subtitle>
          <img
            mat-card-avatar
            src="./assets/azure.svg"
            alt="Azure Logo"
            (dblclick)="goToAdmin()"
          />
        </mat-card-header>
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Enter flight number</mat-label>
            <input
              matInput
              value=""
              type="text"
              formControlName="eventId"
              required
            />
          </mat-form-field>
          <p class="error" *ngIf="error">{{ error }}</p>
          <button
            type="submit"
            [disabled]="!eventForm.valid || loading"
            mat-raised-button
            color="primary"
          >
            Go
          </button>
          <mat-progress-bar
            *ngIf="loading"
            mode="indeterminate"
          ></mat-progress-bar>
        </form>
      </mat-card>
      <p class="version">{{ version }}</p>
    </section>
  `,
  styles: [
    `
      :host {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: #999;
        background-image: radial-gradient(circle at center, #999 0%, #444 100%);
      }
      .mat-card-avatar {
        border-radius: 0;
      }
      form {
        display: flex;
        flex-direction: column;
        background: #fff;
      }
      .error {
        color: red;
      }
      .version {
        opacity: 0.3;
        margin-top: 10px;
        text-align: center;
        font-size: 0.8em;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    `,
  ],
})
export class HomeComponent {
  version: string = environment.version;
  loading = false;
  error: string | null = null;
  eventForm = new FormGroup({
    eventId: new FormControl(''),
  });

  constructor(private router: Router, private eventService: EventService) {}

  async onSubmit() {
    const eventId = this.eventForm.controls.eventId.value;

    try {
      this.loading = true;
      this.error = null;
      await this.eventService.getEvent(eventId);
      this.loading = false;
    } catch (error) {
      console.warn(`Event with ID ${eventId} does not exist!`);
      this.error = 'Invalid flight number.';
      this.loading = false;
      return;
    }

    this.router.navigate(['/event/' + encodeURIComponent(eventId)]);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}
