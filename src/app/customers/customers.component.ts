import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressBarComponent } from '@/shared/ui/progress-bar.component';
import { Customer } from '@/customers/customer.model';
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
        (delete)="store.remove($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomersComponent {
  readonly #dialogService = inject(MatDialog);
  readonly store = inject(CustomersStore);

  create(): void {
    this.#dialogService.open(CustomerModalComponent);
  }

  edit(customer: Customer): void {
    this.#dialogService.open(CustomerModalComponent, { data: customer });
  }
}
