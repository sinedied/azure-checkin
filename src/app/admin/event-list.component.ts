import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-list',
  template: `
    <table mat-table [dataSource]="events" class="mat-elevation-z4">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Event ID</th>
        <td mat-cell *matCellDef="let event">
          <a href="/event/{{ event.id }}" target="_blank">{{ event.id }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef class="md">Event Name</th>
        <td mat-cell *matCellDef="let event" class="md">{{ event.name }}</td>
      </ng-container>

      <ng-container matColumnDef="owner">
        <th mat-header-cell *matHeaderCellDef class="md">Owner</th>
        <td mat-cell *matCellDef="let event" class="md">
          <a href="https://github.com/{{ event.owner }}" target="_blank">{{
            event.owner
          }}</a>
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
        <th mat-header-cell *matHeaderCellDef>Used</th>
        <td mat-cell *matCellDef="let event">
          {{ event.usedPasses }}/{{ event.totalPasses }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [
    `
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

      @media screen and (max-width: 600px) {
        .md {
          display: none;
        }
      }
    `,
  ],
})
export class EventListComponent {
  @Input() events: any[] = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'owner',
    'startDate',
    'endDate',
    'passes',
  ];
}
