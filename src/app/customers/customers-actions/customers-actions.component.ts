import {
  ChangeDetectionStrategy,
  Component,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-customers-actions',
  imports: [FormsModule, MatInput, MatButton, MatFormField, MatIcon],
  template: `
    <mat-form-field appearance="outline">
      <input matInput type="text" placeholder="Search..." [(ngModel)]="query" />
    </mat-form-field>

    <span class="spacer"></span>

    <button mat-stroked-button (click)="refresh.emit()">
      <mat-icon fontIcon="refresh" />
      Refresh
    </button>
    <button mat-flat-button (click)="create.emit()">
      <mat-icon fontIcon="add" />
      Create
    </button>
  `,
  styleUrl: './customers-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersActionsComponent {
  readonly query = model('');
  readonly refresh = output<void>();
  readonly create = output<void>();
}
