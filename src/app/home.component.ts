import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <section class="main">
      <img src="./assets/azure-fluent.png" alt="Azure Logo" />
      <mat-card>
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Enter event name</mat-label>
            <input
              matInput
              value=""
              type="text"
              formControlName="eventName"
              required
            />
          </mat-form-field>
          <button
            type="submit"
            [disabled]="!eventForm.valid"
            mat-raised-button
            color="primary"
          >
            Go
          </button>
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
    `,
  ],
})
export class HomeComponent {
  eventForm = new FormGroup({
    eventName: new FormControl(''),
  });

  constructor(private router: Router) {}

  onSubmit() {
    const eventName = this.eventForm.controls.eventName.value;
    console.log(eventName);
    this.router.navigate(['/event/' + encodeURIComponent(eventName)]);
  }
}
