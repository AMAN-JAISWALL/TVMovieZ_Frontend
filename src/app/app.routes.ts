import { Routes } from '@angular/router';
import { authGuard } from './_gaurd/auth.guard';


export const routes: Routes = [
    {
        path: '',
        loadComponent:()=>import('./components/public-nav/public-nav.component').then(m=>m.PublicNavComponent),
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'login', loadComponent:()=>import('./components/login/login.component').then(m=>m.LoginComponent)  },
            { path: 'register', loadComponent: ()=>import('./components/register/register.component').then(m=>m.RegisterComponent)},
        ]
    },

    {
        path: '',
        loadComponent: ()=>import('./components/private-nav/private-nav.component').then(m=>m.PrivateNavComponent),
        canActivate: [authGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            { path: 'home', loadComponent: ()=>import('./components/starter/starter.component').then(m=>m.StarterComponent) },
        ]
    }



];
