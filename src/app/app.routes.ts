import { Routes } from '@angular/router';
import {AuthComponent} from './features/auth/auth.component';
import {HomeComponent} from './features/home/home.component';
import {AUTH_PATH, HOME_PATH} from './core/constants/routes.constants';
import {AuthGuard} from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: HOME_PATH,
        component: HomeComponent,
        canActivate: [AuthGuard],
    },
    {
        path: AUTH_PATH,
        component: AuthComponent
    }
];
