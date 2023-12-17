import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
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
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: INotificationData,
    ) {}
}

export interface INotificationData {
    message: string;
    icon: string;
}
