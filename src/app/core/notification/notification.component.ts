import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'notification',
    templateUrl: 'notification.html',
    styleUrls: ['notification.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSnackBarModule,
        MatIconModule,
    ],
})
export class NotificationComponent {
    protected readonly data: INotificationData = inject<INotificationData>(MAT_SNACK_BAR_DATA);
}

export interface INotificationData {
    message: string;
    icon: string;
}
