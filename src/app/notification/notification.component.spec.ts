
import {NotificationComponent} from './notification.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator';

fdescribe('NotificationComponent', () => {
    let spectator: Spectator<NotificationComponent>;
    const createComponent: SpectatorFactory<NotificationComponent> = createComponentFactory({
        component: NotificationComponent,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('should create component', () => {
        expect(spectator.query('div')).toHaveClass('notification');
    });

    it('should show message', () => {
        spectator.component.data = {
            icon: 'test-icon',
            message: 'test-message',
        };

        expect(spectator.query('div > mat-icon')).toContainText('test-icon');
        expect(spectator.query('div > span')).toContainText('test-message');
    });
});
