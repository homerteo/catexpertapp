import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cats',
    pathMatch: 'full'
  },
  {
    path: 'cats',
    loadComponent: () => import('./components/cats/cats').then(m => m.Cats)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.Register)
  },
  {
    path: 'user-info',
    loadComponent: () => import('./components/user-info/user-info').then(m => m.UserInfo)
  },
  {
    path: 'cats-filter',
    loadComponent: () => import('./components/cats-filter/cats-filter').then(m => m.CatsFilter)
  },
  {
    path: '**',
    redirectTo: '/cats'
  }
];
