import {Injectable} from '@angular/core';
import {User} from '../interfaces/user.interface';
import {UserRepository} from '../repositories/user.repository';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly userRepository: UserRepository = new UserRepository()
    private currentUser: User | null = null;

    public getCurrentUser(): User | null {
        return this.currentUser
    }
    public setCurrentUser(user: User): void {
        this.currentUser = user
    }

    public getUser(criteria: Partial<Pick<User, "email" | "id">>): User | null {
        return this.userRepository.getUser(criteria)
    }

    public getAllUsers(): User[] {
        return this.userRepository.getAllUsers()
    }

    public findByEmail(email: string): User[] {
        return this.userRepository.findBySubstring({ email })
    }
}

