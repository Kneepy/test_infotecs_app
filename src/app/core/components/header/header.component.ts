import {Component, inject, OnInit} from '@angular/core';
import {Image} from 'primeng/image';
import {Avatar} from 'primeng/avatar';
import {Fluid} from 'primeng/fluid';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {User} from '../../interfaces/user.interface';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {AUTH_PATH} from '../../constants/routes.constants';

@Component({
    selector: 'app-header',
    imports: [
        Avatar,
        Fluid,
        Button,
    ],
    templateUrl: './header.component.html',
    standalone: true,
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    userService: UserService = inject(UserService)
    authService: AuthService = inject(AuthService)
    router: Router = inject(Router)
    currentUser: User | null = null

    ngOnInit(): void {
        this.currentUser = this.userService.getCurrentUser();
    }

    logout() {
        this.authService.logout()
        this.router.navigate([AUTH_PATH])
    }
}
