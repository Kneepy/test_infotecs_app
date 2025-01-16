import {inject, Injectable} from '@angular/core';
import {Message, MessageState} from '../interfaces/message.interface';
import {MESSAGES} from '../constants/local-storage.constants';
import {UserService} from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class MessagesRepository {

    private readonly userService: UserService = inject(UserService)

    private messages: Message[] = []

    constructor() {
        const messagesFromStorage: Message[] = JSON.parse(localStorage.getItem(MESSAGES) ?? "[]")

        if (messagesFromStorage.length) this.messages = messagesFromStorage
        else {
            const allUsers = this.userService.getAllUsers()
            for (const sender of allUsers) {
                for (const receiver of allUsers) {
                    if (sender.id !== receiver.id) {
                        for (let i = 0; i <= 10; i++) {
                            this.messages.push({
                                id: this.messages.length + 1,
                                from: sender,
                                to: receiver,
                                createdAt: (new Date()).toString(),
                                message: `Message ${i} from ${sender.email} to ${receiver.email} \n Hello World!!!!`,
                                state: MessageState.ACTIVE
                            });
                        }
                    }
                }
            }
            localStorage.setItem(MESSAGES, JSON.stringify(this.messages))
        }
    }

    /**
     * Создает новый черновик сообщения
     */
    create(message: Omit<Message, "id" | "state" | "createdAt">): Message {
        const newMessage: Message = { id: this.messages.length + 1, state: MessageState.DRAFT, createdAt: (new Date()).toString(), ...message }

        this.messages.push(newMessage)

        return newMessage
    }

    update(message: Message): Message {
        const msgIndex = this.messages.findIndex(msg => msg.id === message.id)

        if (msgIndex === -1) throw Error()

        this.messages[msgIndex] = message

        return message
    }

    get(id: number): Message | null {
        return this.messages.find(msg => msg.id === id) ?? null
    }

    getAll(): Message[] {
        return [...this.messages].reverse()
    }

    remove(id: number) {
        const msgIndex = this.messages.findIndex(msg => msg.id === id)

        if (msgIndex === -1) throw Error()

        this.messages.splice(msgIndex, 1)
        localStorage.setItem(MESSAGES, JSON.stringify(this.messages))
    }

    /**
     * Отправляет черновик сообщения
     */
    publish(message: Message) {

        const existMessage = this.get(message.id)

        if (!existMessage) return

        /**
         * тут ещё надо добавить проверку отправителей и даты отправки
         * но я думаю это в контексте этой приложухи не надо
         */

        const messagesFromStorage: Message[] = JSON.parse(localStorage.getItem(MESSAGES) ?? "[]")
        const updatedMessage = { ...message, state: MessageState.ACTIVE, createdAt: (new Date()).toString() }
        messagesFromStorage.push(updatedMessage)
        this.update(updatedMessage)

        localStorage.setItem(MESSAGES, JSON.stringify(messagesFromStorage))
    }
}
