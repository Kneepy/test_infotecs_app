import {inject, Injectable} from '@angular/core';
import {User} from '../interfaces/user.interface';
import {FAILED_AUTH, INVALID_PASSWORD} from '../constants/error-messages.constants';
import {SessionRepository} from '../repositories/session.repository';
import {UserRepository} from '../repositories/user.repository';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly sessionRepository: SessionRepository = inject(SessionRepository)
    private readonly userRepository: UserRepository = inject(UserRepository)
    private readonly userService: UserService = inject(UserService)

    public authBySession(): void {
        const userFromStorage: User | null = this.sessionRepository.getSession()

        if (!userFromStorage?.id) throw Error(FAILED_AUTH)

        /**
         * Тут проверяем чтобы пользователь из сессии соответствовал юзеру в базе
         */
        const existUser = this.userRepository.getUser({
            id: userFromStorage.id,
            email: userFromStorage.email,
            password: userFromStorage.password
        })

        if (!existUser?.id) throw Error(FAILED_AUTH)

        this.userService.setCurrentUser(existUser)
    }

    public auth({ email, password }: Omit<User, "id">): User | null {
        const existUser = this.userRepository.getUser({ email });

        if (!existUser) {

            const user = this.userRepository.addUser({ email, password })
            this.sessionRepository.setSession(user)
            this.userService.setCurrentUser(user)

            return user

        } else {

            if (existUser.password === password) {
                this.sessionRepository.setSession(existUser)
                this.userService.setCurrentUser(existUser)

                return existUser
            }

            throw new Error(INVALID_PASSWORD)

        }
    }

    public logout() {
        this.sessionRepository.removeSession()
    }
}
