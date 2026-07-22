import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started/getting-started-page').then((m) => m.GettingStartedPage),
    title: 'Getting Started · Laziar Components',
  },
  {
    path: 'theming',
    loadComponent: () => import('./pages/theming/theming-page').then((m) => m.ThemingPage),
    title: 'Theming · Laziar Components',
  },
  {
    path: 'components/:name',
    loadComponent: () =>
      import('./pages/component-host/component-host-page').then((m) => m.ComponentHostPage),
    title: 'Component · Laziar Components',
  },
  { path: '**', redirectTo: 'getting-started' },
];
