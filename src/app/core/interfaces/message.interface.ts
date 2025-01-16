import {User} from './user.interface';

export enum MessageState {
    DRAFT = 0,
    ACTIVE = 1
}

export interface Message {
    id: number
    from: User
    to: User
    createdAt: string
    message: string
    state: MessageState
}
