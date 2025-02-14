import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Customer } from '@/customers/customer.model';
import { CustomerFormComponent } from '@/customers/customer-form/customer-form.component';
import { CustomerModalStore } from '@/customers/customer-modal/customer-modal.store';

@Component({
  selector: 'app-customer-modal',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButton,
    MatProgressSpinner,
    CustomerFormComponent,
  ],
  template: `
    <h2 mat-dialog-title>{{ customer ? 'Edit' : 'Create' }} Customer</h2>

    <mat-dialog-content>
      <app-customer-form [customer]="customer" />
    </mat-dialog-content>

    <mat-dialog-actions>
      @if (store.isPending()) {
        <mat-spinner />
      }

      <button
        mat-flat-button
        [disabled]="customerForm().form().invalid || store.isPending()"
        (click)="save()"
      >
        Save
      </button>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
    </mat-dialog-actions>
  `,
  styleUrl: './customer-modal.component.scss',
  providers: [CustomerModalStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerModalComponent {
  readonly store = inject(CustomerModalStore);
  readonly dialogRef = inject(MatDialogRef);
  readonly customer = inject<Customer | null>(MAT_DIALOG_DATA);
  readonly customerForm = viewChild.required(CustomerFormComponent);

  save(): void {
    const formValue: Omit<Customer, 'id'> = this.customerForm().form().value;
    this.store.save({ id: this.customer?.id, customer: formValue });
  }
}
