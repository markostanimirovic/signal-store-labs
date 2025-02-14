import { Customer } from '@/customers/customer.model';

export function getFullName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`;
}

export function filterCustomers(
  customers: Customer[],
  query: string,
): Customer[] {
  return customers.filter((customer) =>
    getFullName(customer).toLowerCase().includes(query.toLowerCase()),
  );
}

export function getDeleteCustomerData(customer: Customer): {
  title: string;
  content: string;
} {
  return {
    title: 'Delete Customer',
    content: `Are you sure you want to delete ${getFullName(customer)}?`,
  };
}

export function getEmptyCustomer(): Omit<Customer, 'id'> {
  return { firstName: '', lastName: '', email: '', birthDate: '' };
}
