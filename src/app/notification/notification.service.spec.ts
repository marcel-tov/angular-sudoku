
import {NotificationService} from './notification.service';
import {SpectatorService, createServiceFactory, SpectatorServiceFactory} from '@ngneat/spectator/jest';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationComponent} from './notification.component';

describe('NotificationService', () => {
    let spectator: SpectatorService<NotificationService>;
    const createService: SpectatorServiceFactory<NotificationService> = createServiceFactory({
        service: NotificationService,
        mocks: [
            MatSnackBar,
        ],
    });

    beforeEach(() => spectator = createService());

    it('should show error message', () => {
        spectator.service.showError('test-error');
        expect(spectator.inject(MatSnackBar).openFromComponent).toHaveBeenCalledWith(
            NotificationComponent,
            {
                duration: 5000,
                data: {message: 'test-error', icon: 'error'},
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['notification-wrapper', 'notification-wrapper--error'],
            },
        );
    });

    it('should show success message', () => {
        spectator.service.showSuccess('test-success');
        expect(spectator.inject(MatSnackBar).openFromComponent).toHaveBeenCalledWith(
            NotificationComponent,
            {
                duration: 5000,
                data: {message: 'test-success', icon: 'done'},
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['notification-wrapper', 'notification-wrapper--success'],
            },
        );
    });
});
