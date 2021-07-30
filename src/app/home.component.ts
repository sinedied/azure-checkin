import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from './shared/event.service';

@Component({
  selector: 'app-home',
  template: `
    <section class="main">
      <img
        src="./assets/azure-fluent.png"
        alt="Azure Logo"
        (dblclick)="goToAdmin()"
      />
      <mat-card>
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Enter event code</mat-label>
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
    </section>
  `,
  styles: [
    `
      :host {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background: #0a0e12;
        /* background: #f0f2f7; */
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
      this.error = 'Invalid event code.';
      this.loading = false;
      return;
    }

    this.router.navigate(['/event/' + encodeURIComponent(eventId)]);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}
