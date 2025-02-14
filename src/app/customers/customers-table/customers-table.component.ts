import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Customer } from '@/customers/customer.model';

@Component({
  selector: 'app-customers-table',
  imports: [DatePipe, MatTableModule, MatIconButton, MatIcon],
  template: `
    @if (customers().length > 0) {
      <table mat-table [dataSource]="customers()">
        <ng-container matColumnDef="firstName">
          <th mat-header-cell *matHeaderCellDef>First Name</th>
          <td mat-cell *matCellDef="let customer">{{ customer.firstName }}</td>
        </ng-container>

        <ng-container matColumnDef="lastName">
          <th mat-header-cell *matHeaderCellDef>Last Name</th>
          <td mat-cell *matCellDef="let customer">{{ customer.lastName }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let customer">{{ customer.email }}</td>
        </ng-container>

        <ng-container matColumnDef="birthDate">
          <th mat-header-cell *matHeaderCellDef>Birth Date</th>
          <td mat-cell *matCellDef="let customer">
            {{ customer.birthDate | date }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let customer">
            <button mat-icon-button (click)="edit.emit(customer)">
              <mat-icon class="edit-icon" fontIcon="edit" />
            </button>
            <button mat-icon-button (click)="delete.emit(customer)">
              <mat-icon class="delete-icon" fontIcon="delete" />
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    }
  `,
  styleUrl: './customers-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersTableComponent {
  readonly displayedColumns = [
    'firstName',
    'lastName',
    'email',
    'birthDate',
    'actions',
  ];
  readonly customers = input<Customer[]>([]);
  readonly edit = output<Customer>();
  readonly delete = output<Customer>();
}
