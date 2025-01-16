import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {Button} from 'primeng/button';
import {Panel} from 'primeng/panel';
import {PanelMenu} from 'primeng/panelmenu';
import {Fluid} from 'primeng/fluid';
import {Pages} from '../../constants/pages.constants';

@Component({
    selector: 'app-move-bar',
    imports: [
        Button,
        Panel,
        PanelMenu,
        Fluid,
    ],
    templateUrl: './move-bar.component.html',
    styleUrl: './move-bar.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveBarComponent {
    @Output() create = new EventEmitter();
    @Output() changePage = new EventEmitter<Pages>();

    moves: MenuItem[] = [
        {
            label: 'Входящие',
            icon: 'pi pi-inbox',
            command: (event: MenuItemCommandEvent) => {
                this.changePage.emit(Pages.INCOMING)
            }
        },
        {
            label: 'Отправленные',
            icon: 'pi pi-send',
            command: (event: MenuItemCommandEvent) => {
                this.changePage.emit(Pages.OUTGOING)
            }
        },
        {
            label: 'Черновики',
            icon: 'pi pi-file-o',
            command: (event: MenuItemCommandEvent) => {
                this.changePage.emit(Pages.DRAFTS)
            }
        }
    ]

    writeMessage() {
        this.create.emit()
    }
}
