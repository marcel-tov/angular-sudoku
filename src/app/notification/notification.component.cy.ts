import {INotificationData, NotificationComponent} from './notification.component';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

describe('NotificationComponent', () => {
    beforeEach(() => {
        const data: INotificationData = {
            icon: 'test-icon',
            message: 'test-message',
        };

        cy.mount(NotificationComponent, {
            imports: [
                MatSnackBarModule,
            ],
            providers: [
                {provide: MAT_SNACK_BAR_DATA, useValue: data},
            ],
        });
    });

    it('should be created', () => {
        cy.get('div').should('have.class', 'notification');
    });

    it('should contain icon', () => {
        cy.get('div.notification > mat-icon.notification__icon')
            .should('contain.text', 'test-icon');
    });

    it('should contain message  ', () => {
        cy.get('div.notification > span')
            .should('contain.text', 'test-message');
    });
});
