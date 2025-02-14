import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Customer } from '@/customers/customer.model';
import { getEmptyCustomer } from '@/customers/customer.helpers';

@Component({
  selector: 'app-customer-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  template: `
    <form #form>
      <mat-form-field>
        <mat-label>First Name</mat-label>
        <input
          matInput
          type="text"
          name="firstName"
          required
          [(ngModel)]="model.firstName"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Last Name</mat-label>
        <input
          matInput
          type="text"
          name="lastName"
          required
          [(ngModel)]="model.lastName"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Email</mat-label>
        <input
          matInput
          type="text"
          name="email"
          required
          email
          [(ngModel)]="model.email"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Birth Date</mat-label>
        <input
          matInput
          [matDatepicker]="picker"
          type="text"
          name="birthDate"
          required
          [ngModel]="model.birthDate()"
          [ngModelOptions]="{ updateOn: 'blur' }"
          (ngModelChange)="setBirthDate($event)"
        />
        <mat-hint>YYYY-MM-DD</mat-hint>
        <mat-datepicker-toggle
          matIconSuffix
          [for]="picker"
        ></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </form>
  `,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-CA' },
    provideNativeDateAdapter(),
  ],
  styleUrl: './customer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormComponent {
  readonly customer = input(getEmptyCustomer(), {
    transform: (customer: Customer | null) => customer ?? getEmptyCustomer(),
  });
  protected readonly model = {
    firstName: linkedSignal(() => this.customer().firstName),
    lastName: linkedSignal(() => this.customer().lastName),
    email: linkedSignal(() => this.customer().email),
    birthDate: linkedSignal(() => this.customer().birthDate),
  };
  protected readonly ngForm = viewChild.required('form', { read: NgForm });
  readonly form = computed(() => this.ngForm().form);

  protected setBirthDate(date: Date | null): void {
    this.model.birthDate.set(
      date ? new Intl.DateTimeFormat('en-CA').format(date) : '',
    );
  }
}
