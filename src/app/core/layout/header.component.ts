import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatToolbar, MatIcon, MatAnchor],
  template: `
    <mat-toolbar>
      <a routerLink="/">
        <mat-icon fontIcon="home" />
      </a>
      <span class="spacer"></span>
      <a mat-button routerLink="/customers">Customers</a>
    </mat-toolbar>
  `,
  styles: `
    a {
      color: inherit;
      text-decoration: none;
    }

    mat-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
