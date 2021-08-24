import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
      <app-version></app-version>
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
    `,
  ],
})
export class HomeComponent {
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

    this.router.navigate(['/' + encodeURIComponent(eventId)]);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}
