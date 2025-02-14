import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './customer.model';

const API_URL = 'http://localhost:3000/customers';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  readonly #http = inject(HttpClient);

  getAll(): Observable<Customer[]> {
    return this.#http.get<Customer[]>(API_URL);
  }

  create(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.#http.post<Customer>(API_URL, customer);
  }

  update(customer: Customer): Observable<Customer> {
    return this.#http.put<Customer>(`${API_URL}/${customer.id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${API_URL}/${id}`);
  }
}
