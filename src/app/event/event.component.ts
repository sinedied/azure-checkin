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
        <mat-card>
          <h1>{{ event.name }}</h1>
          <p>Your Azure pass is:</p>
          <h2>
            <code>{{ pass }}</code>
          </h2>
          <p>
            To create an Azure account with your pass, first make sure that:
          </p>
          <ul>
            <li>
              You have a Microsoft account (formerly Live). You can create one
              on
              <a
                href="http://account.microsoft.com?WT.mc_id=javascript-32417-yolasors"
                target="blank"
              >
                account.microsoft.com
              </a>
            </li>
            <li>
              Your Microsoft account was NEVER used for another Azure
              subscription.<br>
              If you ever activated a Free Azure Trial with this
              account, you won't be able to use the Azure Pass. In that case,
              you need to create a new Microsoft account.
            </li>
          </ul>
          <mat-card-actions align="end">
            <a
              mat-raised-button
              color="primary"
              target="_blank"
              href="https://www.microsoftazurepass.com/?WT.mc_id=javascript-32417-yolasors"
            >
              Create Azure account with your Pass
            </a>
          </mat-card-actions>
        </mat-card>
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
      this.pass = (await this.eventService.getPass(this.id)).pass;
    } catch (err) {
      console.error('Error:', err);
      this.router.navigate(['']);
      return;
    }

    this.loaded = true;
  }
}
