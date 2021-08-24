import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../shared/event.service';
import { UserInfo } from '../shared/user-info';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-event',
  template: `
    <div *ngIf="loaded; else loading">
      <app-logout *ngIf="user" redirectUrl="/{{ event.id }}"></app-logout>
      <app-login
        *ngIf="!user; else showPass"
        [id]="id"
        [eventName]="event.name"
      ></app-login>
      <ng-template #showPass>
        <app-pass-card
          *ngIf="pass; else noPass"
          [pass]="pass"
          [userName]="user?.userDetails || ''"
          [event]="event"
        ></app-pass-card>
        <ng-template #noPass>
          <app-no-pass-card [eventName]="event.name"></app-no-pass-card>
        </ng-template>
      </ng-template>
    </div>
    <ng-template #loading>
      <mat-progress-bar
        class="progress"
        mode="indeterminate"
      ></mat-progress-bar>
    </ng-template>
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
      .progress {
        margin: 40px;
      }
      .mat-card {
        margin: 0 20px;
      }
    `,
  ],
})
export class EventComponent implements OnInit {
  loaded = false;
  id: string | null = null;
  user: UserInfo | null = null;
  event: any = null;
  pass: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private eventService: EventService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaded = false;
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) {
      console.warn('No event ID provided!');
      this.router.navigate(['']);
      return;
    }

    try {
      this.user = await this.userService.getUserInfo();
      this.event = await this.eventService.getEvent(this.id);

      if (this.user) {
        await this.getPass();
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error('Error:', error);
        this.snackBar.open(`Error: ${error && error.message}`, '', {
          duration: 5000,
        });
      }
      this.router.navigate(['']);
      return;
    }

    this.loaded = true;
  }

  private async getPass(): Promise<void> {
    try {
      this.pass = (await this.eventService.getPass(this.id!)).pass;
    } catch (error) {
      if (error.response?.status === 422) {
        // no more passes available
        this.pass = null;
      } else {
        throw error;
      }
    }
  }
}
