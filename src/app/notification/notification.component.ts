import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.html',
    styleUrls: ['notification.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
