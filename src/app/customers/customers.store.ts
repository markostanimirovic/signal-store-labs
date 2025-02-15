import { computed, inject } from '@angular/core';
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
import {
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { ConfirmDialogComponent } from '@/shared/ui/confirm-dialog.component';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@/shared/store-utils/request-status.feature';
import { withStorageSync } from '@/shared/store-utils/storage-sync.feature';
import { withErrorHandler } from '@/shared/store-utils/error-handler.feature';
import { Customer } from '@/customers/customer.model';
import {
  filterCustomers,
  getDeleteCustomerData,
} from '@/customers/customer.helpers';
import { CustomersService } from '@/customers/customers.service';

export const CustomersStore = signalStore(
  { providedIn: 'root' },
  withState({ query: '' }),
  withEntities<Customer>(),
  withRequestStatus(),
  withErrorHandler(),
  withComputed(({ entities, query }) => ({
    filteredCustomers: computed(() => filterCustomers(entities(), query())),
  })),
  withProps(() => ({
    _customersService: inject(CustomersService),
    _dialogService: inject(MatDialog),
  })),
  withMethods((store) => {
    const loadAll = rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        exhaustMap(() =>
          store._customersService.getAll().pipe(
            tapResponse({
              next: (customers) =>
                patchState(store, setAllEntities(customers), setFulfilled()),
              error: (error: { message: string }) =>
                patchState(store, setError(error.message)),
            }),
          ),
        ),
      ),
    );

    function setQuery(query: string): void {
      patchState(store, { query });
    }

    function upsert(customer: Customer): void {
      patchState(store, setEntity(customer));
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
            tap(() => patchState(store, setPending())),
            concatMap(() =>
              store._customersService.delete(customer.id).pipe(
                tapResponse({
                  next: () =>
                    patchState(
                      store,
                      removeEntity(customer.id),
                      setFulfilled(),
                    ),
                  error: (error: { message: string }) =>
                    patchState(store, setError(error.message)),
                }),
              ),
            ),
          ),
      ),
    );

    return { loadAll, setQuery, upsert, remove };
  }),
  withStorageSync('customers'),
  withHooks({
    onInit({ loadAll }) {
      loadAll();
    },
  }),
);
