import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Message} from '../../interfaces/message.interface';
import {Avatar} from 'primeng/avatar';
import {NgIf} from '@angular/common';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
    selector: 'app-message',
    imports: [
        Avatar,
        NgIf,
        Divider,
        Button,
        ConfirmDialog
    ],
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ConfirmationService]
})
export class MessageComponent {
    private confirmationService: ConfirmationService = inject(ConfirmationService)

    @Input({ required: true }) message: Message | null = null;

    // если сообщение текущего юзера
    @Input() my: boolean = false

    @Output() open = new EventEmitter();
    @Output() delete = new EventEmitter();

    openMessage() {
        this.open.emit()
    }
    deleteMessage(event: Event) {
        event.stopPropagation()

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Вы действительно хотите удалить это сообщение?',
            header: 'Удалить',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Закрыть',
            closeOnEscape: true,
            rejectButtonProps: {
                label: 'Закрыть',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Удалить',
                severity: 'danger',
            },
            accept: () => {
                this.delete.emit()
            },
            reject: () => {},
        });
    }
}
