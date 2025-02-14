import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <h1>NgRx SignalStore Labs</h1>
      <p>
        A playground project for experimenting with NgRx SignalStore concepts
        and features. Built for learning purposes as part of the SignalStore
        workshop, showcasing practical examples of state management
        implementation.
      </p>

      <img src="/ngrx-logo.svg" alt="NgRx Logo" />
    </div>
  `,
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {}
