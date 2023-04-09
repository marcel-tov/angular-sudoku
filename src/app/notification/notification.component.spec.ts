
import {INotificationData, NotificationComponent} from './notification.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator/jest';
import {MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA} from '@angular/material/legacy-snack-bar';

describe('NotificationComponent', () => {
    const data: INotificationData = {
        icon: 'test-icon',
        message: 'test-message',
    };
    let spectator: Spectator<NotificationComponent>;
    const createComponent: SpectatorFactory<NotificationComponent> = createComponentFactory({
        component: NotificationComponent,
        providers: [
            {provide: MAT_SNACK_BAR_DATA, useValue: data},
        ],
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => {
        spectator = createComponent({
            providers: [
                {provide: MAT_SNACK_BAR_DATA, useValue: data},
            ],
        });
    });

    it('should create component', () => {
        expect(spectator.query('div')).toHaveClass('notification');
    });

    it('should show message', () => {
        spectator.setInput({data});
        expect(spectator.query('div > mat-icon')).toContainText('test-icon');
        expect(spectator.query('div > span')).toContainText('test-message');
    });
});
