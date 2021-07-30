import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { UserInfo } from '../shared/user-info';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-admin',
  template: `<div *ngIf="loaded; else loading" [class.container]="this.user">
      <app-logout *ngIf="this.user"></app-logout>
      <app-login *ngIf="!this.user; else showList"></app-login>
      <ng-template #showList>
        <app-event-list [events]="events"></app-event-list>
      </ng-template>
    </div>
    <ng-template #loading>
      <mat-progress-bar
        class="progress"
        mode="indeterminate"
      ></mat-progress-bar>
    </ng-template>`,
  styles: [
    `
      :host {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: #f0f2f7;
      }
      .container {
        width: 100%;
        padding: 20px;
      }
      .progress {
        margin: 40px;
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  loaded = false;
  id: string | null = null;
  user: UserInfo | null = null;
  events: any[] = [];

  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaded = false;

    try {
      this.user = await this.userService.getUserInfo();

      if (this.user) {
        this.events = await this.eventService.getEvents();
      }
    } catch (err) {
      console.error('Error:', err);
      // this.router.navigate(['']);
      return;
    }

    this.loaded = true;
  }
}
