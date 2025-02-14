import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('@/home/home.component'),
    title: 'Home | NgRx SignalStore Labs',
  },
  {
    path: 'customers',
    loadComponent: () => import('@/customers/customers.component'),
    title: 'Customers | NgRx SignalStore Labs',
  },
  {
    path: '**',
    loadComponent: () => import('@/core/not-found/not-found.component'),
    title: 'Not Found | NgRx SignalStore Labs',
  },
];
