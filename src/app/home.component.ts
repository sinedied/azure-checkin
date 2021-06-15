import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `<img src="./assets/azure-fluent.png" alt="Azure Logo" />
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
    </form> `,
  styles: [],
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
