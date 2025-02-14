import { inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concatMap, pipe, tap } from 'rxjs';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { CustomersService } from '@/customers/customers.service';
import { CustomersStore } from '@/customers/customers.store';
import { Customer } from '@/customers/customer.model';

export const CustomerModalStore = signalStore(
  withState({ isPending: false }),
  withMethods(
    (
      store,
      customersService = inject(CustomersService),
      customersStore = inject(CustomersStore),
      dialogRef = inject(DialogRef),
      snackBar = inject(MatSnackBar),
    ) => ({
      save: rxMethod<{
        id?: number;
        customer: Omit<Customer, 'id'>;
      }>(
        pipe(
          tap(() => patchState(store, { isPending: true })),
          concatMap(({ id, customer }) => {
            const saveCustomer = id
              ? customersService.update({ id, ...customer })
              : customersService.create(customer);

            return saveCustomer.pipe(
              tapResponse({
                next: (customer) => {
                  patchState(store, { isPending: false });
                  customersStore.upsert(customer);
                  dialogRef.close();
                },
                error: (error: { message: string }) => {
                  patchState(store, { isPending: false });
                  snackBar.open(error.message, 'Close', { duration: 5_000 });
                },
              }),
            );
          }),
        ),
      ),
    }),
  ),
);
