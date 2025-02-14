import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.content }}</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-flat-button (click)="dialogRef.close(true)">Yes</button>
      <button mat-button (click)="dialogRef.close(false)">No</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<{ title: string; content: string }>(MAT_DIALOG_DATA);
}
