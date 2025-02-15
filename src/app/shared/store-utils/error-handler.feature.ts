import { inject, Signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, pipe, tap } from 'rxjs';
import {
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export function withErrorHandler() {
  return signalStoreFeature(
    { props: type<{ error: Signal<string | null> }>() },
    withMethods((_, snackBar = inject(MatSnackBar)) => ({
      _handleError: rxMethod<string | null>(
        pipe(
          filter(Boolean),
          tap((message) =>
            snackBar.open(message, 'Close', { duration: 5_000 }),
          ),
        ),
      ),
    })),
    withHooks({
      onInit({ _handleError, error }) {
        _handleError(error);
      },
    }),
  );
}
