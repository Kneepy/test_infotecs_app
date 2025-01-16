import {
    CanActivate,
    GuardResult,
    MaybeAsync,
    Router,
} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AUTH_PATH} from '../constants/routes.constants';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {}

    canActivate(): MaybeAsync<GuardResult> {
        try {
            this.authService.authBySession()

            return true
        } catch (e) {
            console.log(e)
            void this.router.navigate([AUTH_PATH])
            return false
        }
    }
}
