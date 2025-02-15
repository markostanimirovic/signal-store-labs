import { inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { concatMap, filter, pipe, tap } from 'rxjs';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@/shared/store-utils/request-status.feature';
import { withErrorHandler } from '@/shared/store-utils/error-handler.feature';
import { CustomersService } from '@/customers/customers.service';
import { CustomersStore } from '@/customers/customers.store';
import { Customer } from '@/customers/customer.model';

export const CustomerModalStore = signalStore(
  withRequestStatus(),
  withErrorHandler(),
  withMethods(
    (
      store,
      customersService = inject(CustomersService),
      customersStore = inject(CustomersStore),
      dialogRef = inject(DialogRef),
    ) => ({
      save: rxMethod<{
        id?: number;
        customer: Omit<Customer, 'id'>;
      }>(
        pipe(
          tap(() => patchState(store, setPending())),
          concatMap(({ id, customer }) => {
            const saveCustomer = id
              ? customersService.update({ id, ...customer })
              : customersService.create(customer);

            return saveCustomer.pipe(
              tapResponse({
                next: (customer) => {
                  patchState(store, setFulfilled());
                  customersStore.upsert(customer);
                },
                error: (error: { message: string }) => {
                  patchState(store, setError(error.message));
                },
              }),
            );
          }),
        ),
      ),
      closeDialog: rxMethod<boolean>(
        pipe(
          filter(Boolean),
          tap(() => dialogRef.close()),
        ),
      ),
    }),
  ),
  withHooks({
    onInit({ closeDialog, isFulfilled }) {
      closeDialog(isFulfilled);
    },
  }),
);
