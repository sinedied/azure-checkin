import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pass-card',
  template: `
    <mat-card>
      <h1>{{ eventName }}</h1>
      <p>Your Azure pass is:</p>
      <h2>
        <code>{{ pass }}</code>
      </h2>
      <p>To create an Azure account with your pass, first make sure that:</p>
      <ul>
        <li>
          You have a Microsoft account (formerly Live). You can create one on
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
  `,
  styles: [],
})
export class PassCardComponent {
  @Input() eventName: string = '';
  @Input() pass: string = '';
}
