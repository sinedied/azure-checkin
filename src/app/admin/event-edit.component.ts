import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../shared/event';
import { EventPatch, EventService, NewEvent } from '../shared/event.service';

@Component({
  selector: 'app-event-edit',
  template: `
    <div class="container">
      <mat-toolbar class="mat-elevation-z3">
        <button class="back" mat-icon-button matTooltip="Go back to list" routerLink="..">
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
          [disabled]="!event || !event.locked || event.archived"
          matTooltip="Archive event"
          (click)="archiveEvent()"
        >
          <mat-icon aria-hidden="true">archive</mat-icon>
          <span class="hide-xs">Archive</span>
        </button>
        <button
          *ngIf="!this.isNew()"
          mat-button
          [disabled]="!event || event.archived"
          matTooltip="{{ event?.locked ? 'Unlock' : 'Lock' }} event"
          (click)="toggleEventLock()"
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
          (click)="saveEvent()"
        >
          <mat-icon aria-hidden="true">save</mat-icon>
          <span class="hide-xs">Save</span>
        </button>
      </mat-toolbar>
      <div *ngIf="!loaded">
        <mat-progress-bar class="progress" mode="indeterminate"> </mat-progress-bar>
      </div>
      <div class="archived" *ngIf="loaded && event?.archived">This event is archived and cannot be modified.</div>
      <div class="card-wrapper">
        <mat-card>
          <form [formGroup]="eventForm" (ngSubmit)="saveEvent()">
            <div class="form-line first-line">
              <mat-form-field>
                <mat-label>Event name</mat-label>
                <input formControlName="name" matInput placeholder="AwesomeConf" (input)="updatePrefix()" />
              </mat-form-field>
              <mat-form-field *ngIf="this.isNew()" [class.readonly]="!eventForm.controls['editPrefix'].value">
                <mat-label>Flight nº prefix</mat-label>
                <input type="text" formControlName="prefix" matInput />
                <mat-error *ngIf="!eventForm.controls['prefix'].valid">Must be 3 lowercase letters</mat-error>
              </mat-form-field>
              <mat-checkbox *ngIf="this.isNew()" color="primary" formControlName="editPrefix">
                Customize flight nº prefix
              </mat-checkbox>
            </div>
            <div class="form-line">
              <mat-form-field>
                <mat-label>Event dates</mat-label>
                <mat-date-range-input [rangePicker]="picker" [min]="getMinDate()">
                  <input matStartDate formControlName="startDate" placeholder="Start date" />
                  <input matEndDate formControlName="endDate" placeholder="End date" />
                </mat-date-range-input>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-date-range-picker #picker></mat-date-range-picker>
                <mat-hint>Using time zone {{ timezone }}</mat-hint>
              </mat-form-field>
              <div>
                <mat-icon inline aria-hidden="true">info</mat-icon>
                Event will become locked 48h after its end date.
              </div>
            </div>
            <mat-form-field class="passes">
              <mat-label>{{ isNew() ? '' : 'Add' }} Azure passes</mat-label>
              <textarea
                rows="10"
                matInput
                formControlName="passes"
                placeholder="Copy/paste here your list of passes"
              ></textarea>
              <mat-hint>Put 1 pass by line</mat-hint>
            </mat-form-field>
            <div *ngIf="isNew()">
              <mat-icon inline aria-hidden="true">info</mat-icon>
              You can request Azure passes at
              <a href="https://requests.microsoftazurepass.com/" target="_blank">requests.microsoftazurepass.com</a>
            </div>
            <div *ngIf="!isNew() && event">
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title> Azure passes </mat-panel-title>
                  <mat-panel-description>
                    Expand to view {{ !event.locked ? 'and update' : '' }} attribution
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <div role="list">
                  <div class="item" role="listitem" *ngFor="let pass of passes">
                    <code>{{ pass[0] }}</code>
                    <mat-icon>
                      {{ pass[1] ? 'check_circle_outline' : 'radio_button_unchecked' }}
                    </mat-icon>
                    <div class="text-ellipsis hash hide-xs">
                      {{ pass[1] || '' }}
                    </div>
                    <span class="spacer"></span>
                    <button
                      mat-button
                      color="warn"
                      *ngIf="!event.locked && pass[1]"
                      (click)="assignPass(pass[0], false)"
                    >
                      <span class="hide-xs">Clear attribution</span>
                      <mat-icon mat-icon>clear</mat-icon>
                    </button>
                    <button mat-button *ngIf="!event.locked && !pass[1]" (click)="assignPass(pass[0], true)">
                      <span class="hide-xs">Attribute manually</span>
                      <mat-icon>check</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-expansion-panel>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      @use '@angular/material' as mat;
      @use './src/theme' as *;

      .mat-toolbar {
        position: relative;
        font-size: 1em;
        color: #444;
        z-index: 100;
      }
      .back {
        margin-right: 0.5em;
      }
      .mat-stroked-button {
        margin-left: 0.5em;
      }
      .archived {
        padding: 0.25em 0.5em;
        text-align: center;
        background: mat.get-color-from-palette($azure-checkin-warn, 500);
        color: #fff;
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
      .mat-expansion-panel {
        background: #f9f9f9;
      }
      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 0.5em;
        padding-left: 0.5em;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
      .hash {
        flex: 1 1 200px;
        opacity: 0.5;
        max-width: 200px;
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
    prefix: new FormControl('zzz', [Validators.required, Validators.pattern('[a-z]{3}')]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    editPrefix: new FormControl(false),
    passes: new FormControl('', [Validators.required]),
  });
  passes: [string, string | null][] | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private eventService: EventService
  ) {
    const offset = -new Date().getTimezoneOffset() / 60;
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone + ` (UTC${offset < 0 ? offset : '+' + offset})`;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id') || 'new';

    if (!this.isNew()) {
      this.loadEvent();
    }

    this.loaded = true;
  }

  isNew(): boolean {
    return this.id === 'new';
  }

  getDateSuffix(): string {
    const date = this.eventForm.get('startDate')!.value || new Date();
    return this.dateToUtcString(date).split('T')[0].replace(/-/g, '').substring(2);
  }

  getMinDate(): Date {
    const eventDate = (this.event && new Date(this.event.startDate)) || this.today;
    return eventDate < this.today ? eventDate : this.today;
  }

  updatePrefix(): void {
    if (!this.eventForm.controls['editPrefix'].value) {
      const prefix = this.generatePrefix();
      this.eventForm.controls['prefix'].setValue(prefix);
    }
  }

  async assignPass(pass: string, assign: boolean = false): Promise<void> {
    const eventPasses = this.event!.passes!;
    const previousAssignment = eventPasses[pass];
    // Optimistic update
    this.event!.passes![pass] = assign ? '__manually_assigned__' : null;
    this.passes = Object.entries(eventPasses);

    try {
      await this.eventService.assignPass(this.id, pass, assign);
    } catch (error: any) {
      // Revert in case of failure
      eventPasses[pass] = previousAssignment;
      this.passes = Object.entries(eventPasses);

      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`);
    }
  }

  async archiveEvent(): Promise<void> {
    this.loaded = false;
    try {
      const event = this.event!;
      this.eventForm.disable();
      event.archived = true;
      event.locked = true;
      await this.eventService.archiveEvent(this.id);
    } catch (error: any) {
      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`);
    }
    this.loaded = true;
  }

  async toggleEventLock(): Promise<void> {
    this.loaded = false;
    const event = this.event!;
    try {
      this.eventForm.disable();
      event.locked = !event.locked;
      await this.eventService.setEventLock(this.id, event.locked);
    } catch (error: any) {
      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`);
    }
    if (!event.locked) {
      this.eventForm.enable();
    }
    this.loaded = true;
  }

  async saveEvent(): Promise<void> {
    if (this.isNew()) {
      this.saveNewEvent();
    } else {
      this.updateEvent();
    }
  }

  private async loadEvent(): Promise<void> {
    this.loaded = false;
    try {
      this.eventForm.disable();
      this.event = await this.eventService.getEvent(this.id, true);
      this.eventForm.patchValue({
        name: this.event.name,
        startDate: this.event.startDate,
        endDate: this.event.endDate,
      });
      this.eventForm.controls['passes'].setValidators(null);
      this.eventForm.controls['passes'].reset();
      this.passes = Object.entries(this.event.passes || {});
      this.eventForm.markAsPristine();

      if (!this.event.archived && !this.event.locked) {
        this.eventForm.enable();
      }
    } catch (error: any) {
      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`);
    }
    this.loaded = true;
  }

  private async saveNewEvent(): Promise<void> {
    this.loaded = false;
    this.eventForm.disable();
    try {
      const formData = this.eventForm.value;
      const newEvent: NewEvent = {
        id: formData.prefix + this.getDateSuffix(),
        name: formData.name,
        startDate: this.dateToUtcString(formData.startDate),
        endDate: this.dateToUtcString(formData.endDate),
        passes: formData.passes
          .split('\n')
          .filter((pass: string) => pass)
          .map((pass: string) => pass.trim()),
      };
      await this.eventService.createEvent(newEvent);
      this.snackBar.open(`Event ${newEvent.name} successfully created.`);
      this.router.navigate(['/admin']);
    } catch (error: any) {
      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`);
    }
    this.eventForm.enable();
    this.loaded = true;
  }

  private async updateEvent(): Promise<void> {
    this.loaded = false;
    this.eventForm.disable();
    try {
      const formData = this.eventForm.value;
      const eventPatch: EventPatch = {};
      if (this.eventForm.controls['name'].dirty) {
        eventPatch.name = formData.name;
      }
      if (this.eventForm.controls['startDate'].dirty) {
        eventPatch.startDate = this.dateToUtcString(formData.startDate);
      }
      if (this.eventForm.controls['endDate'].dirty) {
        eventPatch.endDate = this.dateToUtcString(formData.endDate);
      }
      if (this.eventForm.controls['passes'].dirty && formData.passes) {
        eventPatch.passes = formData.passes
          .split('\n')
          .filter((pass: string) => pass)
          .map((pass: string) => pass.trim());
      }
      await this.eventService.patchEvent(this.id, eventPatch);
      this.snackBar.open(`Event ${eventPatch.name} successfully updated.`);
    } catch (error: any) {
      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`);
    }
    this.eventForm.enable();
    this.loaded = true;
    return this.loadEvent();
  }

  private dateToUtcString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const isoDate = new Date(date.getTime() - offset * 60 * 1000).toISOString();
    return isoDate.split('T')[0] + 'T00:00:00Z';
  }

  private generatePrefix(): string {
    const name = this.eventForm.controls['name'].value;
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
