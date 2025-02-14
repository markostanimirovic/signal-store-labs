import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from '@/customers/customer.model';
import { CustomersService } from '@/customers/customers.service';
import { CustomerFormComponent } from '@/customers/customer-form/customer-form.component';

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
      @if (isPending()) {
        <mat-spinner />
      }

      <button
        mat-flat-button
        [disabled]="customerForm().form().invalid || isPending()"
        (click)="save()"
      >
        Save
      </button>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
    </mat-dialog-actions>
  `,
  styleUrl: './customer-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerModalComponent {
  readonly #customersService = inject(CustomersService);
  readonly #snackBar = inject(MatSnackBar);
  readonly dialogRef = inject(MatDialogRef);
  readonly customer = inject<Customer | null>(MAT_DIALOG_DATA);
  readonly customerForm = viewChild.required(CustomerFormComponent);
  readonly isPending = signal(false);

  save(): void {
    const formValue: Omit<Customer, 'id'> = this.customerForm().form().value;
    const saveCustomer = this.customer
      ? this.#customersService.update({ id: this.customer.id, ...formValue })
      : this.#customersService.create(formValue);

    this.isPending.set(true);
    saveCustomer.subscribe({
      next: (customer) => {
        this.isPending.set(false);
        this.dialogRef.close(customer);
      },
      error: (error: { message: string }) => {
        this.isPending.set(false);
        this.#snackBar.open(error.message, 'Close', { duration: 5_000 });
      },
    });
  }
}
