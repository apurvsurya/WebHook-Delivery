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
        ]
    }
];
