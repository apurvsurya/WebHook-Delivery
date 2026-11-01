import { Routes } from '@angular/router';
import { LoginLayout } from './layouts/login-layout/login-layout';

export const routes: Routes = [
    {
        path: '', loadComponent: () =>
            import('./layouts/login-layout/login-layout')
                .then(m => m.LoginLayout),
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./layouts/login-layout/login/login')
                        .then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./layouts/login-layout/registeraccount/registeraccount')
                        .then(m => m.Registeraccount)
            },
        ]
    },
    {
        path: 'app', loadComponent: () =>
            import('./layouts/dashboard-layout/dashboard-layout')
                .then(m => m.DashboardLayout),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./components/dashboard-details/dashboard-details')
                        .then(m => m.DashboardDetails)
            },
            {
                path: 'api-keys',
                loadComponent: () =>
                    import('./components/createapikeys/createapikeys')
                        .then(m => m.Createapikeys)
            },
        ]
    }
];
