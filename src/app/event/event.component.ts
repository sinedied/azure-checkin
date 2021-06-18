import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { UserInfo } from '../user-info';
import { UserService } from '../user.service';

@Component({
  selector: 'app-event',
  template: `
    <div *ngIf="loaded; else loading">
      <app-logout *ngIf="this.user"></app-logout>
      <app-login *ngIf="!this.user; else showPass" [id]="id"></app-login>
      <ng-template #showPass>
        ID: {{ id }}
        {{ event | json }}
        <p>Your pass: {{ pass }}</p>
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
        background: #f0f2f7;
      }
      .progress {
        margin: 40px;
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
      this.pass = await this.eventService.getPass(this.id);
    } catch (err) {
      console.error('Error:', err);
      this.router.navigate(['']);
      return;
    }

    this.loaded = true;
  }
}
