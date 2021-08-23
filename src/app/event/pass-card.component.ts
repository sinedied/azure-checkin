import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../shared/event';

@Component({
  selector: 'app-pass-card',
  template: `
    <div class="pass-card">
      <div class="pass-header">
        <h2>{{ event.name }}</h2>
        <span class="hide-sm">Azure Boarding Pass</span>
      </div>
      <div class="pass-body">
        <div class="pass">
          <div class="icon hide-xs">
            <mat-icon inline aria-hidden="true">flight_takeoff</mat-icon>
          </div>
          <div>
            <div class="label">Your Azure pass is</div>
            <code class="pass-text" (click)="copyPassToClipboard()">
              {{ pass }}
              <mat-icon inline matTooltip="Copy to clipboard"
                >content_copy</mat-icon
              >
            </code>
            <input id="pass-code" [value]="pass" />
          </div>
        </div>
        <div class="infos">
          <div class="watermark">Azure</div>
          <div class="line1">
            <div>
              <div class="label">Passenger name</div>
              <div class="value">{{ userName }}</div>
            </div>
            <div class="hide-xs">
              <div class="label">Flight nº</div>
              <div class="value">{{ event.id }}</div>
            </div>
            <div class="hide-sm">
              <div class="label">Seat</div>
              <div class="value">10A</div>
            </div>
            <div class="hide-sm">
              <div class="label">Gate</div>
              <div class="value">{{ gate() }}</div>
            </div>
            <div>
              <div class="label">Boarding time</div>
              <div class="value">22/07/2021</div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div class="pass-footer">
        <img
          class="hide-xs"
          src="/assets/barcode.svg"
          alt="barcode"
          aria-hidden
        />
        <a
          matRipple
          class="button"
          target="_blank"
          href="https://www.microsoftazurepass.com/?WT.mc_id=javascript-32417-yolasors"
        >
          <mat-icon inline>login</mat-icon>
          Get on board with Azure
        </a>
      </div>
    </div>
    <div class="instructions">
      <p>To create an Azure account with your pass, first make sure that:</p>
      <ul>
        <li>
          You have a Microsoft account. You can create one on
          <a
            href="http://account.microsoft.com?WT.mc_id=javascript-32417-yolasors"
            target="blank"
          >
            account.microsoft.com
          </a>
        </li>
        <li>
          Your Microsoft account was NEVER used for another Azure
          subscription.<br />
          If you ever activated a Free Azure Trial with this account, you won't
          be able to use the Azure Pass. In that case, you need to create a new
          Microsoft account.
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      $color: #0ad;
      $maxWidth: min(600px, calc(100vw - 40px));

      .instructions {
        color: #fff;
        max-width: $maxWidth;
        box-sizing: border-box;
        padding: 0 20px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

        a {
          color: lighten($color, 25%);

          &:hover {
            color: lighten($color, 10%);
          }
        }
      }

      .button {
        /* color: $color;
        background: #fff; */
        color: #fff;
        /* border: 1px solid #fff; */
        border: 1px dashed #fff;
        border-radius: 4px;
        text-decoration: none;
        padding: 3px 10px;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        > .mat-icon {
          vertical-align: bottom;
        }
      }

      .pass-card {
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: $maxWidth;
        margin: 0 auto;
        /* box-shadow: 0 0 100px rgba(0, 0, 0, 0.25); */
        background: linear-gradient(to right, $color, adjust-hue($color, 10%));
        border-top: 1px solid darken($color, 5%);
        border-bottom: 1px solid darken($color, 5%);
        margin-bottom: 20px;
        mask-image: linear-gradient(
            to right,
            transparent 8px,
            #000 9px,
            #000 51%,
            transparent 0
          ),
          linear-gradient(
            to left,
            transparent 8px,
            #000 9px,
            #000 51%,
            transparent 0
          ),
          radial-gradient(
            circle at 0 0px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 30px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 60px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 90px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 120px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 150px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 180px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 210px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 240px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 270px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 0 300px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 0px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 30px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 60px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 90px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 120px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 150px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 180px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 210px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 240px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 270px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          ),
          radial-gradient(
            circle at 100% 300px,
            transparent 8px,
            black 9px,
            black 20px,
            transparent 0
          );
      }

      .pass-header,
      .pass-footer {
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;

        > h2 {
          margin: 0;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        > span {
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.2em;
          white-space: nowrap;
          margin-left: 20px;
        }
      }

      .pass-body {
        display: flex;
        flex-direction: column;
      }

      .pass {
        background-color: #f7f7f7;
        display: flex;
        flex-direction: row;
        height: 118px;
        box-sizing: border-box;
      }

      .icon {
        font-size: 3.5rem;
        line-height: 3.5rem;
        flex: 0 1 auto;
        margin-right: 20px;
        margin-bottom: -20px;
      }

      .pass-text {
        display: inline-block;
        margin-top: 10px;
        cursor: pointer;
        font-size: 1.2em;
        font-weight: normal;

        > .mat-icon {
          vertical-align: bottom;
        }
      }

      #pass-code {
        position: absolute;
        top: -9999px;
      }

      .pass,
      .infos {
        padding: 30px;
        font-family: Arial Narrow, Arial;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 1.1em;
      }

      .infos {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: #eee;
        color: #444;
        overflow: hidden;
      }

      .watermark {
        position: absolute;
        left: -10px;
        top: -10px;
        font-family: Arial;
        font-size: 9rem;
        line-height: 8rem;
        vertical-align: text-bottom;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.3);
        z-index: 0;
      }

      .label {
        color: #999;
      }

      .line1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        z-index: 1;
      }

      .hide-xs,
      .hide-sm {
        display: none;
      }

      @media screen and (min-width: 481px) {
        .hide-xs {
          display: initial;
        }

        .pass-text {
          font-size: 1.4em;
        }
      }

      @media screen and (min-width: 768px) {
        .hide-sm {
          display: initial;
        }

        .pass-text {
          font-size: 2.4em;
        }
      }
    `,
  ],
})
export class PassCardComponent {
  @Input() event!: Event;
  @Input() userName: string = '';
  @Input() pass: string = '';

  constructor(private snackBar: MatSnackBar) {}

  copyPassToClipboard() {
    const pass = document.querySelector('#pass-code') as HTMLInputElement;
    pass.select();
    document.execCommand('copy');

    this.snackBar.open('Copied to clipboard!', '', { duration: 2000 });
  }

  gate(): string {
    return this.event.id.charAt(2).toUpperCase();
  }
}
