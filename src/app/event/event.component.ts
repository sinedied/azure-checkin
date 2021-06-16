import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from '../user-info';
import { UserService } from '../user.service';

@Component({
  selector: 'app-event',
  template: `
    <div *ngIf="loaded; else loading">
      <app-logout *ngIf="this.user"></app-logout>
      <app-login *ngIf="!this.user; else showPass" [id]="id"></app-login>
      <ng-template #showPass> ID: {{ id }} </ng-template>
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaded = false;
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) {
      console.warn('No event ID provided!');
      this.router.navigate(['']);
    }

    this.user = await this.userService.getUserInfo();
    this.loaded = true;
  }
}
