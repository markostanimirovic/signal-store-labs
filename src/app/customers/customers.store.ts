import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { concatMap, exhaustMap, filter, pipe, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { ConfirmDialogComponent } from '@/shared/ui/confirm-dialog.component';
import { Customer } from '@/customers/customer.model';
import {
  filterCustomers,
  getDeleteCustomerData,
} from '@/customers/customer.helpers';
import { CustomersService } from '@/customers/customers.service';

type CustomersState = {
  customers: Customer[];
  query: string;
  isPending: boolean;
};

const initialState: CustomersState = {
  customers: [],
  query: '',
  isPending: false,
};

export const CustomersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ customers, query }) => ({
    filteredCustomers: computed(() => filterCustomers(customers(), query())),
  })),
  withProps(() => ({
    _customersService: inject(CustomersService),
    _snackBar: inject(MatSnackBar),
    _dialogService: inject(MatDialog),
  })),
  withMethods((store) => {
    function handleError(message: string): void {
      patchState(store, { isPending: false });
      store._snackBar.open(message, 'Close', { duration: 5_000 });
    }

    const loadAll = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isPending: true })),
        exhaustMap(() =>
          store._customersService.getAll().pipe(
            tapResponse({
              next: (customers) =>
                patchState(store, { customers, isPending: false }),
              error: (error: { message: string }) => handleError(error.message),
            }),
          ),
        ),
      ),
    );

    function setQuery(query: string): void {
      patchState(store, { query });
    }

    function upsert(customer: Customer): void {
      patchState(store, ({ customers }) => {
        const isUpdate = customers.find((c) => c.id === customer.id);

        return {
          customers: isUpdate
            ? customers.map((c) => (c.id === customer.id ? customer : c))
            : [...customers, customer],
        };
      });
    }

    const remove = rxMethod<Customer>(
      concatMap((customer) =>
        store._dialogService
          .open(ConfirmDialogComponent, {
            data: getDeleteCustomerData(customer),
          })
          .afterClosed()
          .pipe(
            filter(Boolean),
            tap(() => patchState(store, { isPending: true })),
            concatMap(() =>
              store._customersService.delete(customer.id).pipe(
                tapResponse({
                  next: () =>
                    patchState(store, ({ customers }) => ({
                      customers: customers.filter((c) => c.id !== customer.id),
                      isPending: false,
                    })),
                  error: (error: { message: string }) =>
                    handleError(error.message),
                }),
              ),
            ),
          ),
      ),
    );

    return { loadAll, setQuery, upsert, remove };
  }),
  withHooks({
    onInit({ loadAll }) {
      loadAll();
    },
  }),
);
