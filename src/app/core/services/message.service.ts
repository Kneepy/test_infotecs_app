import {MessagesRepository} from '../repositories/messages.repository';
import {inject, Injectable} from '@angular/core';
import {Message, MessageState} from '../interfaces/message.interface';
import {UserService} from './user.service';
import {User} from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private readonly messageRepository: MessagesRepository = inject(MessagesRepository);

    private readonly userService: UserService = inject(UserService);

    public getAllMessages(): Message[] {
        return (this.messageRepository.getAll()).map(msg => {
            return {...msg, createdAt: this.getDateMessage(msg.createdAt)}
        })
    }

    public getIncomingMessages(): Message[] {
        const currentUser = this.userService.getCurrentUser() as User
        return this.getAllMessages().filter(msg => msg.to.email === currentUser.email && msg.state !== MessageState.DRAFT)
    }

    public getOutgoingMessages(): Message[] {
        const currentUser = this.userService.getCurrentUser() as User
        return this.getAllMessages().filter(msg => msg.from.email === currentUser.email && msg.state !== MessageState.DRAFT)
    }

    public getDraftMessages(): Message[] {
        const currentUser = this.userService.getCurrentUser() as User
        return this.getAllMessages().filter(msg => msg.from.email === currentUser.email && msg.state === MessageState.DRAFT)
    }

    public getDateMessage(createdAt: string): string {
        return (new Date(createdAt)).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }

    public saveDraftMessage(message: Pick<Message, "to" | "message"> & Partial<Omit<Message, "to" | "message">>): Message {
        if (!message.id) {
            return this.messageRepository.create({
                ...message,
                from: this.userService.getCurrentUser() as User
            })
        }

        return this.messageRepository.update({
            ...(message as Message),
            from: this.userService.getCurrentUser() as User
        })
    }

    public sendMessage(message: Pick<Message, "to" | "message"> & Partial<Omit<Message, "to" | "message">>): void {
        const draftMessage = this.saveDraftMessage(message)

        if (draftMessage.state !== MessageState.DRAFT) throw new Error()

        this.messageRepository.publish(draftMessage)
    }

    public deleteMessage(id: number) {
        this.messageRepository.remove(id)
    }
}
