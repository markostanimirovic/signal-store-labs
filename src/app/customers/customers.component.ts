import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { concatMap, filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProgressBarComponent } from '@/shared/ui/progress-bar.component';
import { ConfirmDialogComponent } from '@/shared/ui/confirm-dialog.component';
import { CustomersService } from '@/customers/customers.service';
import { Customer } from '@/customers/customer.model';
import { getDeleteCustomerData } from '@/customers/customer.helpers';
import { CustomersStore } from '@/customers/customers.store';
import { CustomersTableComponent } from '@/customers/customers-table/customers-table.component';
import { CustomersActionsComponent } from '@/customers/customers-actions/customers-actions.component';
import { CustomerModalComponent } from '@/customers/customer-modal/customer-modal.component';

@Component({
  selector: 'app-customers',
  imports: [
    ProgressBarComponent,
    CustomersTableComponent,
    CustomersActionsComponent,
  ],
  template: `
    <app-progress-bar [showProgress]="store.isPending()" />

    <div class="container">
      <h1>Customers ({{ store.filteredCustomers().length }})</h1>

      <app-customers-actions
        [query]="store.query()"
        (queryChange)="store.setQuery($event)"
        (refresh)="store.loadAll()"
        (create)="create()"
      />
      <app-customers-table
        [customers]="store.filteredCustomers()"
        (edit)="edit($event)"
        (delete)="delete($event)"
      />
    </div>
  `,
  providers: [CustomersStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomersComponent {
  readonly #customersService = inject(CustomersService);
  readonly #dialogService = inject(MatDialog);
  readonly store = inject(CustomersStore);

  create(): void {
    this.#dialogService
      .open(CustomerModalComponent)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((customer: Customer) => this.store.add(customer));
  }

  edit(customer: Customer): void {
    this.#dialogService
      .open(CustomerModalComponent, { data: customer })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((customer: Customer) => this.store.update(customer));
  }

  delete(customer: Customer): void {
    this.#dialogService
      .open(ConfirmDialogComponent, {
        data: getDeleteCustomerData(customer),
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        concatMap(() => {
          this.store.setPending();
          return this.#customersService.delete(customer.id);
        }),
      )
      .subscribe({
        next: () => this.store.remove(customer.id),
        error: (error: { message: string }) =>
          this.store.handleError(error.message),
      });
  }
}
