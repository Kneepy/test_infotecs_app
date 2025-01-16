import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabel} from 'primeng/floatlabel';
import {CardModule} from 'primeng/card';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';
import {FluidModule} from 'primeng/fluid';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {HOME_PATH} from '../../core/constants/routes.constants';

@Component({
    selector: 'app-auth',
    imports: [FormsModule, ReactiveFormsModule, InputTextModule, FloatLabel, CardModule, Password, Button, FluidModule, NgClass],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
    emailFormControl = new FormControl("", [Validators.email])
    passwordFormControl = new FormControl("",[Validators.minLength(6)])

    router = inject(Router)
    authService = inject(AuthService)

    auth() {
        if (this.emailFormControl.invalid || this.passwordFormControl.invalid) return

        try {
            const user = this.authService.auth({
                email: this.emailFormControl.value as string,
                password: this.passwordFormControl.value as string
            })

            if (user) {
                void this.router.navigate([ HOME_PATH ])
            }
        }
        catch(e) {
            this.passwordFormControl.setErrors({ incorrect: (e as any)?.message })
        }
    }
}
