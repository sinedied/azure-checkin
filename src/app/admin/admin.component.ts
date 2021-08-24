import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfo } from '../shared/user-info';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-admin',

  template: `
    <div *ngIf="loaded; else loading" [class.container]="user">
      <app-login *ngIf="!user; else showAdmin"></app-login>
      <ng-template #showAdmin>
        <div class="main">
          <mat-toolbar color="primary">
            <img class="logo" src="./assets/azure.svg" alt="Azure Logo" />
            <span>Azure Check-In</span>
            <span class="spacer"></span>
            <button mat-flat-button routerLink="/admin/new">
              <mat-icon aria-hidden="true">add</mat-icon>
              Create event
            </button>
            <app-logout
              *ngIf="user"
              redirectUrl="/admin"
              inline="true"
            ></app-logout>
          </mat-toolbar>
          <router-outlet></router-outlet>
        </div>
        <app-version></app-version>
      </ng-template>
    </div>
    <ng-template #loading>
      <mat-progress-bar class="progress" mode="indeterminate">
      </mat-progress-bar>
    </ng-template>
  `,
  styles: [
    `
      $primary: #039be5;

      :host {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: #999;
        background-image: radial-gradient(circle at center, #999 0%, #444 100%);
      }
      .container {
        width: 100%;
        height: 100%;
      }
      .main {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }
      .progress {
        margin: 40px;
      }
      .mat-toolbar {
        background: linear-gradient(to right, lighten($primary, 10%), $primary);

        .mat-flat-button {
          margin: 0 10px;
        }
      }
      .spacer {
        flex: 1 1 auto;
      }
      .logo {
        height: 40px;
        width: 40px;
        flex-shrink: 0;
        object-fit: cover;
        filter: drop-shadow(0 0 20px #fff);
        margin: 0 1em 0 0.5em;
      }

      @media screen and (min-width: 768px) {
        .main {
          padding: 20px 20px 0 20px;
        }
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  loaded = false;
  user: UserInfo | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaded = false;

    try {
      this.user = await this.userService.getUserInfo();
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open(`Error: ${error && error.message}`, '', {
        duration: 5000,
      });
    }

    this.loaded = true;
  }
}
