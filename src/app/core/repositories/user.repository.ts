import {Injectable} from '@angular/core';
import {User} from '../interfaces/user.interface';
import {USERS} from '../constants/local-storage.constants';

const TEST_USERS = [
    { id: 1, email: "alice@example.com", password: "Alice2025!" },
    { id: 2, email: "bob@example.com", password: "Bob@1234" },
    { id: 3, email: "charlie@example.com", password: "Charlie99!" },
    { id: 4, email: "diana@example.com", password: "Diana#2025" },
    { id: 5, email: "edward@example.com", password: "Edward$789" },
    { id: 6, email: "fiona@example.com", password: "Fiona*567" },
    { id: 7, email: "george@example.com", password: "George&345" },
    { id: 8, email: "hannah@example.com", password: "Hannah^123" },
    { id: 9, email: "ian@example.com", password: "Ian(456)" },
    { id: 10, email: "jack@example.com", password: "Jack)678" },
]

@Injectable({
    providedIn: 'root'
})
export class UserRepository {
    private users: User[] = []

    constructor() {
        this.init()
        this.users = this.getAllUsers()
    }

    private init() {
        const users = localStorage.getItem(USERS);

        if (!!users?.length) return

        localStorage.setItem(USERS, JSON.stringify(TEST_USERS));
    }

    public getUser(criteria: Partial<User>): User | null {
        return this.users.find(user =>
            Object.entries(criteria).every(([key, val]: [string, any]) => val === user[key as keyof User])
        ) ?? null
    }

    public findBySubstring({ email }: Pick<User, "email">): User[] {
        return this.users.filter(user => user.email.includes(email))
    }

    public addUser({ email, password }: Omit<User, "id">): User {
        const existUser = this.users.find(user => user.email === email)

        if (existUser?.id) return existUser

        const user = { email, password, id: this.users.length + 1 }

        this.users.push(user)
        localStorage.setItem(USERS, JSON.stringify(this.users))

        return user
    }

    public getAllUsers(): User[] {
        const strUsers = localStorage.getItem(USERS)

        if(!strUsers) return []

        return JSON.parse(strUsers);
    }
}
