import { Injectable } from '@angular/core';
import { NotificationComponent, INotificationData } from './notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';

enum NotificationType {
  Error = 'Error',
  Success = 'Success',
}

@Injectable()
export class NotificationService {
    private readonly durationInSeconds: number = 5;

    constructor(private snackBar: MatSnackBar) { }

    public showError(message: string): void {
        this.showNotification(message, NotificationType.Error);
    }

    public showSuccess(message: string): void {
        this.showNotification(message, NotificationType.Success);
    }

    private showNotification(message: string, type: NotificationType): void {
        let icon: string;
        const panelClass: Array<string> = ['notification-wrapper'];
        switch (type) {
            case NotificationType.Error:
                icon = 'error';
                panelClass.push('notification-wrapper--error');
                break;
            case NotificationType.Success:
                icon = 'done';
                panelClass.push('notification-wrapper--success');
                break;
            default:
                throw new Error('given type is not supported yet');
        }

        const data: INotificationData = {
            message,
            icon,
        };

        this.snackBar.openFromComponent<NotificationComponent>(NotificationComponent, {
            duration: this.durationInSeconds * 1_000,
            data,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass,
        });
    }
}

