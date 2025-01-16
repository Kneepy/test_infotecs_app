import {User} from '../interfaces/user.interface';
import {UserRepository} from './user.repository';
import {inject, Injectable} from '@angular/core';
import {USER_SESSION} from '../constants/local-storage.constants';

/**
 * Это хранилище сессии пользователя
 * Сессией выступают данные пользователя
 * Да так делать вообще не надо, но раз тестовое)))
 */
@Injectable({
    providedIn: 'root'
})
export class SessionRepository {
    private readonly userRepository: UserRepository = inject(UserRepository)

    public setSession(user: User): void {
        const hasUser = !!this.userRepository.getUser({ id: user.id })

        if (!hasUser) return

        localStorage.setItem(USER_SESSION, JSON.stringify(user))
    }

    public removeSession(): void {
        localStorage.removeItem(USER_SESSION)
    }

    public getSession(): User | null {
        const strSession = localStorage.getItem(USER_SESSION)

        if (!strSession) return null

        return JSON.parse(strSession)
    }
}
