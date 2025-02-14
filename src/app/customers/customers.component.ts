import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { concatMap, filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProgressBarComponent } from '@/shared/ui/progress-bar.component';
import { ConfirmDialogComponent } from '@/shared/ui/confirm-dialog.component';
import { CustomersService } from '@/customers/customers.service';
import { Customer } from '@/customers/customer.model';
import {
  filterCustomers,
  getDeleteCustomerData,
} from '@/customers/customer.helpers';
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
    <app-progress-bar [showProgress]="isPending()" />

    <div class="container">
      <h1>Customers ({{ filteredCustomers().length }})</h1>

      <app-customers-actions
        [(query)]="query"
        (refresh)="refresh()"
        (create)="create()"
      />
      <app-customers-table
        [customers]="filteredCustomers()"
        (edit)="edit($event)"
        (delete)="delete($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomersComponent {
  readonly #customersService = inject(CustomersService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #dialogService = inject(MatDialog);
  readonly customers = signal<Customer[]>([]);
  readonly isPending = signal(false);
  readonly query = signal('');
  readonly filteredCustomers = computed(() =>
    filterCustomers(this.customers(), this.query()),
  );

  constructor() {
    this.loadAll();
  }

  refresh(): void {
    this.loadAll();
  }

  create(): void {
    this.#dialogService
      .open(CustomerModalComponent)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((customer: Customer) => {
        this.customers.update((customers) => [...customers, customer]);
      });
  }

  edit(customer: Customer): void {
    this.#dialogService
      .open(CustomerModalComponent, { data: customer })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((customer: Customer) => {
        this.customers.update((customers) =>
          customers.map((c) => (c.id === customer.id ? customer : c)),
        );
      });
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
          this.isPending.set(true);
          return this.#customersService.delete(customer.id);
        }),
      )
      .subscribe({
        next: () => {
          this.customers.update((customers) =>
            customers.filter((c) => c.id !== customer.id),
          );
          this.isPending.set(false);
        },
        error: (error: { message: string }) => this.handleError(error.message),
      });
  }

  private loadAll(): void {
    this.isPending.set(true);

    this.#customersService.getAll().subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.isPending.set(false);
      },
      error: (error: { message: string }) => this.handleError(error.message),
    });
  }

  private handleError(message: string): void {
    this.isPending.set(false);
    this.#snackBar.open(message, 'Close', { duration: 5_000 });
  }
}
