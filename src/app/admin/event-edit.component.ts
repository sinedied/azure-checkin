import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../shared/event';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-event-edit',
  template: `
    <div class="container">
      <mat-toolbar class="mat-elevation-z3">
        <button mat-icon-button matTooltip="Go back to list" routerLink="..">
          <mat-icon aria-hidden="true">arrow_back</mat-icon>
        </button>
        <div class="text-ellipsis">
          {{ id === 'new' ? 'Create new event' : 'Edit ' + id }}
        </div>
        <span class="spacer"></span>
        <button
          *ngIf="!this.isNew()"
          mat-button
          color="warn"
          [disabled]="!event || !event.locked"
          matTooltip="Archive event"
        >
          <mat-icon aria-hidden="true">archive</mat-icon>
          <span class="hide-xs">Archive</span>
        </button>
        <button
          *ngIf="!this.isNew()"
          mat-button
          [disabled]="!event || event.archived"
          matTooltip="{{ event?.locked ? 'Unlock' : 'Lock' }} event"
        >
          <mat-icon aria-hidden="true">
            {{ event?.locked ? 'lock_open' : 'lock' }}
          </mat-icon>
          <span class="hide-xs">{{ event?.locked ? 'Unlock' : 'Lock' }}</span>
        </button>
        <button
          mat-button
          [disabled]="!loaded || eventForm.invalid || eventForm.pristine"
          matTooltip="Save event"
        >
          <mat-icon aria-hidden="true">save</mat-icon>
          <span class="hide-xs">Save</span>
        </button>
      </mat-toolbar>
      <div class="card-wrapper">
        <mat-card>
          <form [formGroup]="eventForm" (ngSubmit)="saveEvent()">
            <div class="form-line first-line">
              <mat-form-field>
                <mat-label>Event name</mat-label>
                <input
                  formControlName="name"
                  matInput
                  placeholder="AwesomeConf"
                  (input)="updatePrefix()"
                />
              </mat-form-field>
              <mat-form-field
                *ngIf="this.isNew()"
                [class.readonly]="!eventForm.controls.editPrefix.value"
              >
                <mat-label>Flight nº prefix</mat-label>
                <input type="text" formControlName="prefix" matInput />
                <mat-error *ngIf="!eventForm.controls.prefix.valid"
                  >Must be 3 lowercase letters</mat-error
                >
              </mat-form-field>
              <mat-checkbox
                *ngIf="this.isNew()"
                color="primary"
                formControlName="editPrefix"
              >
                Customize flight nº prefix
              </mat-checkbox>
            </div>
            <div class="form-line">
              <mat-form-field>
                <mat-label>Event dates</mat-label>
                <mat-date-range-input
                  [rangePicker]="picker"
                  [min]="getMinDate()"
                >
                  <input
                    matStartDate
                    formControlName="startDate"
                    placeholder="Start date"
                  />
                  <input
                    matEndDate
                    formControlName="endDate"
                    placeholder="End date"
                  />
                </mat-date-range-input>
                <mat-datepicker-toggle
                  matSuffix
                  [for]="picker"
                ></mat-datepicker-toggle>
                <mat-date-range-picker #picker></mat-date-range-picker>
                <mat-hint>Using time zone {{ timezone }}</mat-hint>
              </mat-form-field>
              <div>
                <mat-icon inline aria-hidden="true">info</mat-icon>
                Event will become locked 48h after its end date.
              </div>
            </div>
            <mat-form-field class="passes">
              <mat-label>Azure Passes</mat-label>
              <textarea
                rows="10"
                matInput
                formControlName="passes"
                placeholder="Copy/paste here your list of passes"
              ></textarea>
              <mat-hint>Put 1 pass by line</mat-hint>
            </mat-form-field>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .mat-toolbar {
        position: relative;
        font-size: 1em;
        color: #444;
        z-index: 100;
      }
      .mat-icon-button {
        margin-right: 0.5em;
      }
      .mat-stroked-button {
        margin-left: 0.5em;
      }
      .container {
        position: relative;
        background-color: #ddd;
        z-index: 10;
        overflow: hidden;
      }
      .card-wrapper {
        padding: 20px;
        box-sizing: border-box;
      }
      .mat-card {
        max-width: 768px;
        margin: 0 auto;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }
      .form-line {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }
      .passes {
        width: 100%;
      }
      .readonly {
        opacity: 0.5;
        pointer-events: none;
      }
      .mat-icon-inline {
        vertical-align: bottom;
      }

      @media screen and (min-width: 768px) {
        .form-line {
          flex-direction: row;
          align-items: center;
        }
        .mat-form-field:not(.passes) {
          width: 200px;
        }
      }
    `,
  ],
})
export class EventEditComponent implements OnInit {
  today = new Date();
  timezone: string;
  loaded = false;
  id: string = 'new';
  event: Event | null = null;
  eventForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(128)]),
    prefix: new FormControl('zzz', [
      Validators.required,
      Validators.pattern('[a-z]{3}'),
    ]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    editPrefix: new FormControl(false),
    passes: new FormControl('', [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private eventService: EventService
  ) {
    const offset = -new Date().getTimezoneOffset() / 60;
    this.timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone +
      ` (UTC${offset < 0 ? offset : '+' + offset})`;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id') || 'new';
    console.log(this.id);

    if (!this.isNew()) {
      try {
        this.eventForm.disable();
        this.event = await this.eventService.getEvent(this.id, true);
        this.eventForm.patchValue({
          name: this.event.name,
          startDate: this.event.startDate,
          endDate: this.event.endDate,
          passes: Object.keys(this.event.passes || {}).join('\n'),
        });
        this.eventForm.enable();
        console.log(this.eventForm);
      } catch (error) {
        console.error('Error:', error);
        this.snackBar.open(`Error: ${error && error.message}`, '', {
          duration: 5000,
        });
      }
    }

    this.loaded = true;
  }

  isNew(): boolean {
    return this.id === 'new';
  }

  dateSuffix(): string {
    const date = this.eventForm.get('startDate')!.value || new Date();
    return this.dateToUtcString(date)
      .split('T')[0]
      .replace(/-/g, '')
      .substring(2);
  }

  getMinDate(): Date {
    const eventDate =
      (this.event && new Date(this.event.startDate)) || this.today;
    return eventDate < this.today ? eventDate : this.today;
  }

  updatePrefix(): void {
    if (!this.eventForm.controls.editPrefix.value) {
      const prefix = this.generatePrefix();
      this.eventForm.controls.prefix.setValue(prefix);
    }
  }

  saveEvent(): void {}

  private dateToUtcString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const isoDate = new Date(date.getTime() - offset * 60 * 1000).toISOString();
    return isoDate.split('T')[0] + 'T00:00:00Z';
  }

  private generatePrefix(): string {
    const name = this.eventForm.controls.name.value;
    let prefix = '';

    if (name) {
      // First we try to get initials from the name, to build sort of an acronym
      let uppercaseLetters = name.match(/[A-Z]/g);
      uppercaseLetters = uppercaseLetters ? uppercaseLetters.join('') : '';
      prefix += uppercaseLetters.substring(1, 3).toLowerCase();

      if (prefix.length < 3) {
        // Then if we're missing some letters, complete with first letters from the name
        let letters = name.match(/[a-zA-Z]/g);
        letters = letters ? letters.join('') : '';
        prefix = letters.substring(0, 3 - prefix.length).toLowerCase() + prefix;
      }
    }

    prefix = prefix.padEnd(3, 'z');
    return prefix;
  }
}
