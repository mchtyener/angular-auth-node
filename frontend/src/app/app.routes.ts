import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { otpGuard } from './guards/otp.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home-one/home-one.component').then(m => m.HomeOneComponent),
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard],
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'verify-email/:token',
        loadComponent: () => import('./components/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
    },
    {
        path: 'reset-password',
        canActivate: [otpGuard],
        loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
    }

];
