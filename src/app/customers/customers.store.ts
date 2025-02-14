import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Customer } from '@/customers/customer.model';
import { filterCustomers } from '@/customers/customer.helpers';
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
  withState(initialState),
  withComputed(({ customers, query }) => ({
    filteredCustomers: computed(() => filterCustomers(customers(), query())),
  })),
  withProps(() => ({
    _customersService: inject(CustomersService),
    _snackBar: inject(MatSnackBar),
  })),
  withMethods((store) => {
    function handleError(message: string): void {
      patchState(store, { isPending: false });
      store._snackBar.open(message, 'Close', { duration: 5_000 });
    }

    function loadAll(): void {
      patchState(store, { isPending: true });

      store._customersService.getAll().subscribe({
        next: (customers) => patchState(store, { customers, isPending: false }),
        error: (error: { message: string }) => handleError(error.message),
      });
    }

    function setQuery(query: string): void {
      patchState(store, { query });
    }

    function setPending(): void {
      patchState(store, { isPending: true });
    }

    function add(customer: Customer): void {
      patchState(store, ({ customers }) => ({
        customers: [...customers, customer],
      }));
    }

    function update(customer: Customer): void {
      patchState(store, ({ customers }) => ({
        customers: customers.map((c) => (c.id === customer.id ? customer : c)),
      }));
    }

    function remove(id: number): void {
      patchState(store, ({ customers }) => ({
        customers: customers.filter((c) => c.id !== id),
        isPending: false,
      }));
    }

    return { handleError, loadAll, setQuery, setPending, add, remove, update };
  }),
  withHooks({
    onInit({ loadAll }) {
      loadAll();
    },
  }),
);
