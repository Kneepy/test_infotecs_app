import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {Fieldset} from 'primeng/fieldset';
import {MoveBarComponent} from '../../core/components/move-bar/move-bar.component';
import {Fluid} from 'primeng/fluid';
import {MessageComponent} from '../../core/components/message/message.component';
import {DataView} from 'primeng/dataview';
import {Message, MessageState} from '../../core/interfaces/message.interface';
import {NgForOf, NgIf} from '@angular/common';
import {MessageService} from '../../core/services/message.service';
import {Drawer} from 'primeng/drawer';
import {Avatar} from 'primeng/avatar';
import {Divider} from 'primeng/divider';
import {ButtonDirective} from 'primeng/button';
import { MessageService as ToastService} from 'primeng/api'
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {User} from '../../core/interfaces/user.interface';
import {UserService} from '../../core/services/user.service';
import {Pages} from '../../core/constants/pages.constants';
import {Editor} from 'primeng/editor';
import {FloatLabel} from 'primeng/floatlabel';
import {Toast} from 'primeng/toast';

@Component({
    selector: 'app-home',
    imports: [
        HeaderComponent,
        Fieldset,
        MoveBarComponent,
        Fluid,
        MessageComponent,
        DataView,
        NgForOf,
        Drawer,
        Avatar,
        Divider,
        ButtonDirective,
        InputText,
        FormsModule,
        Editor,
        FloatLabel,
        Toast,
        NgIf,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    providers: [ToastService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit{
    toastService: ToastService = inject(ToastService)

    messagesService: MessageService = inject(MessageService)
    userService: UserService = inject(UserService)

    messages: Message[] = []
    currentChapter: Pages = Pages.INCOMING
    isViewMessage = false
    isNewMessage = false
    currentMessage: Message | null = null
    currentUser: User = this.userService.getCurrentUser() as User

    draftMessage: Pick<Message, "message" | "to"> & Partial<Omit<Message, "message" | "to">> = {
        to: {
            email: ""
        } as User,
        message: "",
    }

    ngOnInit(): void {
        this.updateMessages()
        this.clearDraft()
    }

    updateMessages() {
        if(this.currentChapter === Pages.INCOMING) this.messages = this.messagesService.getIncomingMessages()
        if(this.currentChapter === Pages.OUTGOING) this.messages = this.messagesService.getOutgoingMessages()
        if(this.currentChapter === Pages.DRAFTS) this.messages = this.messagesService.getDraftMessages()
    }

    changePage(page: Pages) {
        this.currentChapter = page
        this.updateMessages()
    }

    clearDraft() {
        this.draftMessage = {
            to: {
                email: ""
            } as User,
            message: "",
        }
    }

    // сделать функции открытия входящих, исходящих, черновиков

    openMessage(message: Message): void {
        if (message.state === MessageState.ACTIVE) {
            this.isViewMessage = true
            this.currentMessage = message
        } else {
            this.draftMessage = message
            this.isNewMessage = true
        }
    }

    saveDraft() {
        if(!this.draftMessage.to?.email) return

        const user = this.userService.getUser({ email: this.draftMessage.to.email })

        if (!user) return

        this.messagesService.saveDraftMessage({ ...this.draftMessage, to: user })
        this.updateMessages()
        this.clearDraft()
        this.isNewMessage = false
        this.toastService.add({ severity: 'secondary', summary: 'Сохранено', detail: `Черновик сообщения сохранен`, sticky: false });
    }

    sendMessage() {
        if(!this.draftMessage.to?.email) return

        const user = this.userService.getUser({ email: this.draftMessage.to.email })

        if (!user) {
            this.toastService.add({ severity: 'error', summary: 'Ошибка отправки!', detail: `Пользователь с почтой ${this.draftMessage.to.email} не найден`, sticky: false });
            return
        }

        this.messagesService.sendMessage({ ...this.draftMessage, to: user })
        this.updateMessages()
        this.clearDraft()
        this.isNewMessage = false
        this.toastService.add({ severity: 'success', summary: 'Отправлено', detail: `Сообщение пользователю ${user.email} отправлено`, sticky: false });
    }

    deleteMessage(message: Message) {
        this.messagesService.deleteMessage(message.id)
        this.updateMessages()
        this.toastService.add({ severity: 'success', summary: 'Удалено', detail: `Сообщение удалено`, sticky: false });
    }

    replyMessage() {
        if (!this.currentMessage?.id) return

        const currentMessage = this.currentMessage as Message
        this.draftMessage.to.email = currentMessage.from.email
        this.isNewMessage = true
        this.isViewMessage = false
    }

    protected readonly Pages = Pages;
}
