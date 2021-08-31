import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../shared/event.service';
import { Event as AppEvent } from '../shared/event';

@Component({
  selector: 'app-event-list',
  template: `
    <table mat-table [dataSource]="events" class="mat-elevation-z4">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Flight nº</th>
        <td mat-cell *matCellDef="let event" class="no-wrap">
          <a (click)="stopPropagation($event)" href="/{{ event.id }}" target="_blank">{{ event.id }}</a>
          <button mat-icon-button matTooltip="Copy link" (click)="copyLink($event, event.id)">
            <mat-icon inline>content_copy</mat-icon>
            <input class="copy" [id]="'event-' + event.id" [value]="getLink(event.id)" />
          </button>
        </td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef class="md">Event Name</th>
        <td mat-cell *matCellDef="let event" class="md">{{ event.name }}</td>
      </ng-container>

      <ng-container matColumnDef="owner">
        <th mat-header-cell *matHeaderCellDef class="md">Owner</th>
        <td mat-cell *matCellDef="let event" class="md">
          <a (click)="stopPropagation($event)" href="https://github.com/{{ event.owner }}" target="_blank">
            {{ event.owner }}
          </a>
        </td>
      </ng-container>

      <ng-container matColumnDef="startDate">
        <th mat-header-cell *matHeaderCellDef>Start Date</th>
        <td mat-cell *matCellDef="let event">
          {{ event.startDate | localDate }}
        </td>
      </ng-container>

      <ng-container matColumnDef="endDate">
        <th mat-header-cell *matHeaderCellDef class="md">End Date</th>
        <td mat-cell *matCellDef="let event" class="md">
          {{ event.endDate | localDate }}
        </td>
      </ng-container>

      <ng-container matColumnDef="passes">
        <th mat-header-cell *matHeaderCellDef>Seats</th>
        <td mat-cell *matCellDef="let event">{{ event.usedPasses }}/{{ event.totalPasses }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row [routerLink]="'/admin/' + event.id" *matRowDef="let event; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [
    `
      $primary: #039be5;

      a {
        color: $primary;

        &:hover {
          color: lighten($primary, 10%);
        }
      }
      .copy {
        position: absolute;
        top: -9999px;
      }
      .mat-table {
        width: 100%;
      }
      .mat-cell,
      .mat-header-cell {
        padding: 0 10px;
      }
      .mat-row:hover {
        background-color: rgba(0, 0, 0, 5%);
        cursor: pointer;
      }
      .no-wrap {
        white-space: nowrap;
      }
      .mat-icon.mat-icon-inline {
        vertical-align: baseline;
      }

      @media screen and (max-width: 768px) {
        .md {
          display: none;
        }
      }
    `,
  ],
})
export class EventListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'owner', 'startDate', 'endDate', 'passes'];
  loaded = false;
  events: AppEvent[] = [];

  constructor(private snackBar: MatSnackBar, private eventService: EventService) {}

  async ngOnInit(): Promise<void> {
    this.loaded = false;

    try {
      this.events = await this.eventService.getEvents();
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`);
    }

    this.loaded = true;
  }

  copyLink(event: Event, eventId: string) {
    event.stopPropagation();
    const copyText = document.getElementById(`event-${eventId}`) as HTMLInputElement;
    copyText.select();
    document.execCommand('copy');

    this.snackBar.open('Copied to clipboard!', '', { duration: 2000 });
  }

  getLink(eventId: string): string {
    return `${window.location.origin}/${eventId}`;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
